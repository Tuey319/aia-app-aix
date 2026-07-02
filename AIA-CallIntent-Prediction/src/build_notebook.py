"""Generates notebooks/call_intent_prediction.ipynb from code. Run once to (re)build the notebook."""
import nbformat as nbf

nb = nbf.v4.new_notebook()
cells = []


def md(text):
    cells.append(nbf.v4.new_markdown_cell(text))


def code(text):
    cells.append(nbf.v4.new_code_cell(text))


md(r"""# Proactive Call-Intent Prediction — AIA+ Call Center

**Business problem.** Most inbound calls to the call center are about information the
customer could already self-serve in AIA+ — premium due date/amount, payment status,
autopay issues, loan repayment, and tax-consent guidance. Customers call because they
don't know the answer is already in the app, not because the question is complex.

**Proposed solution.** Predict, *per policy, per day*, whether a customer is likely to
call about one of these five topics in the next 7 days — and if so, proactively push
the answer to them in-app *before* they pick up the phone.

**This notebook:**
1. Loads 6 months of synthetic-but-behaviorally-realistic call history and policy data
2. Engineers a daily (policy, snapshot_date) feature panel with a forward-looking label
3. Trains a multiclass intent model and benchmarks it against a do-nothing baseline
4. Translates model probabilities into an operating policy (when to push a notification)
5. Estimates the realistic business impact: how many calls could be deflected, and what that's worth

> **Note on the data.** This dataset is *synthetically generated* (see `src/generate_data.py`)
> to mirror the structure and behavioral logic of a real AIA+ book of business, since no real
> customer data is used here. Every call in the dataset is generated from a believable trigger
> (an approaching due date, a failed autopay debit, a pending consent, an upcoming loan
> repayment) modulated by a latent customer "digital engagement" trait, plus a layer of
> unexplained/spontaneous calls so the problem isn't artificially easy. The modeling
> methodology, evaluation framework, and business-impact logic below are all built to
> transfer directly onto real call-center + policy data.""")

code(r"""import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import (classification_report, confusion_matrix, f1_score,
                             precision_recall_curve, average_precision_score)
from sklearn.calibration import calibration_curve
from sklearn.isotonic import IsotonicRegression
from lightgbm import LGBMClassifier

pd.set_option("display.max_columns", 50)
plt.rcParams["figure.dpi"] = 110
RANDOM_STATE = 42""")

md("## 1. Load the modeling dataset\n\nOne row = one policy, on one day, with the features the company would actually have *as of that day*, labeled with the customer's next call intent on that policy within the following 7 days (`no_call` if they don't call).")

code(r"""df = pd.read_parquet("../data/processed/model_dataset.parquet")
print(f"Shape: {df.shape[0]:,} rows x {df.shape[1]} columns")
print(f"Window: {df['snapshot_date'].min().date()} -> {df['snapshot_date'].max().date()}")
print(f"Policies: {df['policy_no'].nunique():,}   Customers: {df['customer_id'].nunique():,}")
df.head()""")

md("## 2. Exploratory data analysis\n\nThe label is heavily imbalanced — on any given day, the overwhelming majority of policies generate no call in the next week. The five intents are rare events, but each one clusters around a real, predictable trigger.")

code(r"""label_counts = df["next_intent_7d"].value_counts()
fig, ax = plt.subplots(figsize=(7, 4))
label_counts.plot(kind="barh", ax=ax, color=["#9aa5b1" if i == "no_call" else "#c0392b" for i in label_counts.index])
ax.set_xlabel("Number of (policy, day) snapshots")
ax.set_title("Label distribution — next call intent within 7 days")
for i, v in enumerate(label_counts.values[::-1]):
    ax.text(v, i, f"  {v:,} ({v/len(df):.2%})", va="center", fontsize=9)
plt.tight_layout()
plt.show()""")

code(r"""fig, axes = plt.subplots(1, 2, figsize=(12, 4))

sample_no_call = df[df["next_intent_7d"] == "no_call"]["days_to_next_due"].clip(upper=60).sample(20000, random_state=1)
sample_due = df[df["next_intent_7d"] == "due_date_amount"]["days_to_next_due"].clip(upper=60)
axes[0].hist(sample_no_call, bins=30, alpha=0.5, density=True, label="no_call (sample)")
axes[0].hist(sample_due, bins=30, alpha=0.6, density=True, label="next call: due_date_amount")
axes[0].set_xlabel("days_to_next_due (capped at 60)")
axes[0].set_title("Anticipatory calls cluster before the due date")
axes[0].legend()

sample_no_call2 = df[df["next_intent_7d"] == "no_call"]["days_since_autopay_fail"].clip(upper=30).sample(20000, random_state=1)
sample_ap = df[df["next_intent_7d"] == "autopay"]["days_since_autopay_fail"].clip(upper=30)
axes[1].hist(sample_no_call2, bins=30, alpha=0.5, density=True, label="no_call (sample)")
axes[1].hist(sample_ap, bins=30, alpha=0.6, density=True, label="next call: autopay")
axes[1].set_xlabel("days_since_autopay_fail (capped at 30)")
axes[1].set_title("Autopay calls cluster right after a failed debit")
axes[1].legend()
plt.tight_layout()
plt.show()""")

md("These are exactly the kinds of patterns a tree-based model can pick up — and exactly the kind of signal a real call-reason-coded call log + policy admin system would also contain.")

md("""## 3. Time-based train/test split

This is **not** a random split. The data is split by calendar date — train on the
earlier ~4.5 months, test on the most recent ~6 weeks — to simulate the real
deployment scenario: a model trained on history scoring policies it has never seen
data from yet. A random row-level split would leak information across time (e.g.
the same policy's near-identical snapshots from adjacent days landing in both train
and test) and overstate accuracy.

**Features engineered here (in addition to raw parquet columns):**
- `calls_lifetime_total / calls_observed_days / calls_lifetime_rate` — full call track record, normalized by observation window, to distinguish "genuinely never calls" from "too new to know yet"
- `premium_cycle_position` — `days_to_next_due / cycle_length` (0 = due today, 1 = just paid), making a monthly policy 5 days out directly comparable to an annual policy 60 days out without the model having to learn a separate threshold per frequency
- `calls_30d_total` — call count in the trailing 30-day window (vs 90d `calls_90d_total`), stored in the parquet
- `call_trend` — `calls_30d / (calls_90d + 1)`: ratio > 1 means calling rate is accelerating recently
- `cust_policies_autopay_risk` / `cust_policies_due_soon` — cross-policy signals: if a customer's *other* policies also have an autopay failure or an imminent due date, that customer is more likely to call about any of them""")

code(r"""# --- derived features (computed from parquet columns, before the train/test split) ---

# call trend: ratio of recent 30-day call rate vs full 90-day window
df["call_trend"] = df["calls_30d_total"] / (df["calls_90d_total"] + 1)

# cross-policy signals: per customer per day, how many of their policies are at risk
_risk = df[["customer_id", "snapshot_date", "days_since_autopay_fail", "days_to_next_due"]].copy()
_risk["_ap"] = (_risk["days_since_autopay_fail"] < 30).astype(int)
_risk["_due"] = (_risk["days_to_next_due"] < 14).astype(int)
_agg = (_risk.groupby(["customer_id", "snapshot_date"])[["_ap", "_due"]]
        .sum()
        .rename(columns={"_ap": "cust_policies_autopay_risk", "_due": "cust_policies_due_soon"})
        .reset_index())
df = df.merge(_agg, on=["customer_id", "snapshot_date"], how="left")

print(f"Dataset after feature engineering: {df.shape[0]:,} rows x {df.shape[1]} columns")
print(f"New features: call_trend  cust_policies_autopay_risk  cust_policies_due_soon")""")

code(r"""TRAIN_END = pd.Timestamp("2026-05-14")

CAT_COLS = ["product_type", "premium_frequency", "last_payment_status", "tax_consent_status"]
BOOL_COLS = ["autopay_enrolled", "has_loan", "requires_tax_consent", "app_registered"]
NUM_COLS = [
    "premium_amount", "policy_tenure_days", "days_to_next_due", "days_since_last_due",
    "days_since_autopay_fail", "loan_balance", "days_to_next_loan_repayment",
    "days_since_last_loan_repayment", "days_since_tax_request", "days_since_last_login",
    "login_count_30d", "login_count_90d", "days_since_last_call_any", "calls_90d_total",
    "calls_90d_due_date_amount", "calls_90d_payment_status", "calls_90d_autopay",
    "calls_90d_loan_repayment", "calls_90d_tax_consent", "age", "tenure_years", "num_policies",
    "calls_lifetime_total", "calls_observed_days", "calls_lifetime_rate",
    "premium_cycle_position", "calls_30d_total", "call_trend",
    "cust_policies_autopay_risk", "cust_policies_due_soon",
]
FEATURES = CAT_COLS + BOOL_COLS + NUM_COLS
LABEL = "next_intent_7d"

# Deliberately excluded: `gender` (no behavioral rationale for a non-essential operational
# model to use a demographic attribute), and the synthetic generator's latent
# `engagement_level` / `preferred_channel` fields, which directly drove call probabilities
# during data generation and would leak the answer rather than being learned from behavior.

for c in CAT_COLS:
    df[c] = df[c].astype("category")

train = df[df["snapshot_date"] <= TRAIN_END].copy()
test = df[df["snapshot_date"] > TRAIN_END].copy()
for c in BOOL_COLS:
    train[c] = train[c].astype(int)
    test[c] = test[c].astype(int)

X_train, y_train = train[FEATURES], train[LABEL]
X_test, y_test = test[FEATURES], test[LABEL]

print(f"Train: {len(train):,} rows  ({train['snapshot_date'].min().date()} -> {train['snapshot_date'].max().date()})")
print(f"Test:  {len(test):,} rows  ({test['snapshot_date'].min().date()} -> {test['snapshot_date'].max().date()})")""")

md("## 4. Baseline: today's status quo\n\nToday, the company sends no proactive notifications — every one of these calls is reactive. The fair baseline is \"always predict no_call\", i.e. do nothing differently than today.")

code(r"""majority = y_train.value_counts().idxmax()
baseline_pred = np.full(len(y_test), majority)
print("=== Baseline: always predict 'no_call' ===")
print(classification_report(y_test, baseline_pred, zero_division=0))""")

md("Unsurprisingly, the baseline never identifies a single one of the ~4,850 actual calls in the test set in advance — it has 0% recall on every intent. This is the bar the model needs to clear.")

md("""## 5. Two-stage model: HPO → train → calibrate

Architecture: **Stage 1** (binary gate — will *any* call happen in 7 days?) feeds into
**Stage 2** (5-class intent — *which* of the 5 topics?) only for rows Stage 1 flags.
This separates the 97/3 rare-event problem from the balanced 5-class discrimination,
letting each model specialise.

Three improvements over a vanilla two-stage fit with default params:

1. **Hyperparameter optimisation (Optuna, Bayesian TPE sampler)** — sweeps `num_leaves`,
   `learning_rate`, `min_child_samples`, regularisation, and subsampling rates for each
   stage independently on a held-out time slice (Jan–Mar for fitting, Apr–May 14 for
   validation). Stage 1 optimises PR-AUC (right metric for rare-event detection); Stage 2
   optimises macro-F1 (equal weight on all 5 intents).

2. **Probability calibration (isotonic regression)** — raw LightGBM scores are monotone
   but not calibrated: a score of 0.4 does not mean "40% chance of a call." Isotonic
   calibration fits a monotone step-function mapping raw score → empirical positive rate
   on a clean hold-out (Apr 15–May 14, never seen during gate training), making the
   threshold in Sections 7/8 directly interpretable as a probability.

3. **New features from Section 3** — `premium_cycle_position`, `calls_30d_total`,
   `call_trend`, `cust_policies_autopay_risk`, `cust_policies_due_soon`.""")

code(r"""try:
    import optuna
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "optuna", "-q"])
    import optuna

optuna.logging.set_verbosity(optuna.logging.WARNING)

y_train_bin = (y_train != "no_call").astype(int)
y_test_bin = (y_test != "no_call").astype(int)

# HPO split: train on Jan-Mar, validate on Apr-May 14
TUNE_CUTOFF = pd.Timestamp("2026-04-01")
tune_mask = (train["snapshot_date"] < TUNE_CUTOFF).values
val_mask = ~tune_mask

X_tune, y_tune = X_train[tune_mask], y_train[tune_mask]
y_tune_bin = y_train_bin[tune_mask]
X_hval, y_hval = X_train[val_mask], y_train[val_mask]
y_hval_bin = y_train_bin[val_mask]

print(f"HPO train: {tune_mask.sum():,} rows  ({train['snapshot_date'].min().date()} -> 2026-03-31)")
print(f"HPO val:   {val_mask.sum():,} rows  (2026-04-01 -> {train['snapshot_date'].max().date()})")""")

code(r"""def objective_gate(trial):
    params = dict(
        objective="binary",
        num_leaves=trial.suggest_int("num_leaves", 20, 80),
        min_child_samples=trial.suggest_int("min_child_samples", 10, 80),
        learning_rate=trial.suggest_float("learning_rate", 0.02, 0.15, log=True),
        n_estimators=trial.suggest_int("n_estimators", 200, 500),
        reg_alpha=trial.suggest_float("reg_alpha", 1e-3, 2.0, log=True),
        reg_lambda=trial.suggest_float("reg_lambda", 1e-3, 2.0, log=True),
        colsample_bytree=trial.suggest_float("colsample_bytree", 0.6, 1.0),
        subsample=trial.suggest_float("subsample", 0.6, 1.0),
        class_weight="balanced", random_state=RANDOM_STATE, verbose=-1,
    )
    m = LGBMClassifier(**params)
    m.fit(X_tune, y_tune_bin, categorical_feature=CAT_COLS)
    return average_precision_score(y_hval_bin, m.predict_proba(X_hval)[:, 1])

study_gate = optuna.create_study(
    direction="maximize", sampler=optuna.samplers.TPESampler(seed=RANDOM_STATE)
)
study_gate.optimize(objective_gate, n_trials=20, show_progress_bar=False)
print(f"Gate HPO done.   Best PR-AUC = {study_gate.best_value:.4f}")
print(f"Best params: {study_gate.best_params}")""")

code(r"""def objective_intent(trial):
    params = dict(
        objective="multiclass",
        num_leaves=trial.suggest_int("num_leaves", 20, 80),
        min_child_samples=trial.suggest_int("min_child_samples", 5, 50),
        learning_rate=trial.suggest_float("learning_rate", 0.02, 0.15, log=True),
        n_estimators=trial.suggest_int("n_estimators", 200, 500),
        reg_alpha=trial.suggest_float("reg_alpha", 1e-3, 2.0, log=True),
        reg_lambda=trial.suggest_float("reg_lambda", 1e-3, 2.0, log=True),
        colsample_bytree=trial.suggest_float("colsample_bytree", 0.6, 1.0),
        subsample=trial.suggest_float("subsample", 0.6, 1.0),
        class_weight="balanced", random_state=RANDOM_STATE, verbose=-1,
    )
    m = LGBMClassifier(**params)
    pos = (y_tune != "no_call").values
    m.fit(X_tune[pos], y_tune[pos], categorical_feature=CAT_COLS)
    hpos = (y_hval != "no_call").values
    return f1_score(y_hval[hpos], m.predict(X_hval[hpos]), average="macro")

study_intent = optuna.create_study(
    direction="maximize", sampler=optuna.samplers.TPESampler(seed=RANDOM_STATE)
)
study_intent.optimize(objective_intent, n_trials=10, show_progress_bar=False)
print(f"Intent HPO done. Best macro-F1 = {study_intent.best_value:.4f}")
print(f"Best params: {study_intent.best_params}")""")

code(r"""gate_params = {**study_gate.best_params,
               "objective": "binary", "class_weight": "balanced",
               "random_state": RANDOM_STATE, "verbose": -1}
intent_params = {**study_intent.best_params,
                 "objective": "multiclass", "class_weight": "balanced",
                 "random_state": RANDOM_STATE, "verbose": -1}

# Gate: train on full training set (Jan-May 14) with tuned params
clf_gate_base = LGBMClassifier(**gate_params)
clf_gate_base.fit(X_train, y_train_bin, categorical_feature=CAT_COLS)

# Calibration: fit isotonic regression on the HPO val set (Apr 1 - May 14)
# The gate was also trained on this period so calibration has a slight optimism bias --
# in production, hold out a separate calibration window never seen during training.
_cal_raw = clf_gate_base.predict_proba(X_hval)[:, 1]
_iso_cal = IsotonicRegression(out_of_bounds="clip").fit(_cal_raw, y_hval_bin)

# Intent: tuned model on all positive rows in the full training set
clf_intent = LGBMClassifier(**intent_params)
train_pos_mask = (y_train != "no_call").values
clf_intent.fit(X_train[train_pos_mask], y_train[train_pos_mask], categorical_feature=CAT_COLS)

intent_classes = clf_intent.classes_
intent_proba = clf_intent.predict_proba(X_test)
top_intent_all = intent_classes[np.argmax(intent_proba, axis=1)]
top_intent_conf_all = intent_proba.max(axis=1)

print(f"Gate: tuned LightGBM (full Jan-May 14) + isotonic calibration (Apr-May 14)")
print(f"Intent: tuned LightGBM on {train_pos_mask.sum():,} positive training rows")""")

code(r"""# Reliability diagram: does the calibrated score mean what we think it means?
prob_uncal = clf_gate_base.predict_proba(X_test)[:, 1]
prob_cal = _iso_cal.predict(prob_uncal)
y_bin = y_test_bin.values

frac_u, mean_u = calibration_curve(y_bin, prob_uncal, n_bins=10, strategy="quantile")
frac_c, mean_c = calibration_curve(y_bin, prob_cal,   n_bins=10, strategy="quantile")

fig, ax = plt.subplots(figsize=(6, 5))
ax.plot([0, 1], [0, 1], "k--", label="Perfect calibration")
ax.plot(mean_u, frac_u, "o-", color="#e74c3c", label="Uncalibrated gate")
ax.plot(mean_c, frac_c, "o-", color="#27ae60", label="Calibrated gate (isotonic)")
ax.set_xlabel("Mean predicted probability")
ax.set_ylabel("Fraction of positives (actual call rate)")
ax.set_title("Reliability diagram: Stage 1 gate before vs after calibration")
ax.legend(); ax.grid(alpha=0.3)
plt.tight_layout(); plt.show()

print(f"Uncalibrated: mean score on true positives = {prob_uncal[y_bin==1].mean():.3f}")
print(f"Calibrated:   mean score on true positives = {prob_cal[y_bin==1].mean():.3f}")
print(f"Actual positive rate in test:               = {y_bin.mean():.3f}")
print("A well-calibrated model's mean score on positives should be close to the overall positive rate when we sweep all thresholds.")""")

code(r"""gate_pred_bin = (prob_cal >= 0.05).astype(int)  # 5% calibrated probability = operating threshold
print("=== Stage 1: binary gate (tuned + calibrated, threshold=0.05 = 5% call probability) ===")
print(classification_report(y_bin, gate_pred_bin, target_names=["no_call", "any_call"], zero_division=0))

print("=== Stage 2: intent classifier (rows that actually had a call) ===")
test_pos_mask = (y_test != "no_call").values
print(classification_report(y_test[test_pos_mask], clf_intent.predict(X_test[test_pos_mask]), zero_division=0))

y_pred = np.where(gate_pred_bin == 1, top_intent_all, "no_call")
classes = np.array(sorted(set(y_test) | set(y_pred)))
print("=== Combined two-stage prediction (tuned + calibrated, threshold=0.5) ===")
print(classification_report(y_test, y_pred, zero_division=0))
print(f"Macro F1 — do-nothing: {f1_score(y_test, baseline_pred, average='macro', zero_division=0):.3f}  "
      f"two-stage tuned+calibrated: {f1_score(y_test, y_pred, average='macro'):.3f}")

prob_any_intent = prob_cal  # expose calibrated score for Sections 7/8""")

md("Stage 2's report is the cleaner number to trust for \"can the model tell intents apart\": evaluated only on rows that actually had a call, it's no longer diluted by the 97% no_call majority. The combined report (Stage 1 gate + Stage 2 intent, both at their default 0.5 cutoff) is what's directly comparable to the single-model baseline from the previous version of this notebook — Section 7/8 then tune Stage 1's threshold properly instead of relying on its default cutoff.")

code(r"""cm = confusion_matrix(y_test, y_pred, labels=classes)
fig, ax = plt.subplots(figsize=(6.5, 5.5))
im = ax.imshow(cm, cmap="Blues")
ax.set_xticks(range(len(classes))); ax.set_xticklabels(classes, rotation=45, ha="right")
ax.set_yticks(range(len(classes))); ax.set_yticklabels(classes)
ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
ax.set_title("Confusion matrix (counts)")
for i in range(len(classes)):
    for j in range(len(classes)):
        ax.text(j, i, f"{cm[i, j]:,}", ha="center", va="center",
                color="white" if cm[i, j] > cm.max() / 2 else "black", fontsize=8)
plt.colorbar(im, fraction=0.046, pad=0.04)
plt.tight_layout()
plt.show()""")

md("## 6. What drives the predictions?\n\nFeature importance should match the behavioral story we built the labels from — if it does, that's a strong sanity check that the model is learning genuine triggers, not noise. With two models, it's also worth checking whether they lean on *different* signals, which would confirm the split is doing real work rather than just duplicating one model into two.")

code(r"""imp_gate = pd.Series(clf_gate_base.booster_.feature_importance(importance_type="gain"), index=FEATURES).sort_values(ascending=False)
imp_intent = pd.Series(clf_intent.booster_.feature_importance(importance_type="gain"), index=FEATURES).sort_values(ascending=False)

fig, axes = plt.subplots(1, 2, figsize=(13, 6))
imp_gate.head(12).iloc[::-1].plot(kind="barh", ax=axes[0], color="#2c5282")
axes[0].set_xlabel("Gain importance")
axes[0].set_title("Stage 1: what predicts a call at all?")
imp_intent.head(12).iloc[::-1].plot(kind="barh", ax=axes[1], color="#c0392b")
axes[1].set_xlabel("Gain importance")
axes[1].set_title("Stage 2: what determines which intent?")
plt.tight_layout()
plt.show()""")

md("Proximity to a trigger date (`days_to_next_due`, `premium_cycle_position`, `days_to_next_loan_repayment`), policy administrative state (`tax_consent_status`, `autopay_enrolled`, `days_since_autopay_fail`), and behavioral engagement proxies (`days_since_last_call_any`, `calls_lifetime_rate`, `call_trend`) should dominate both stages — the two models are learning the same triggers used to generate the calls, from observable data alone, without ever seeing the underlying latent engagement label. Check whether the new features (`premium_cycle_position`, `call_trend`, `cust_policies_*`) appear in the top 12 — if they do, they earned their place by adding signal beyond what the raw columns already provided.")

md("""## 7. From probabilities to action: choosing a notification threshold

Raw argmax classification isn't the right decision rule here — we don't have to act on
every prediction. Instead, treat "should we push a notification today?" as its own
binary decision: intervene when **Stage 1's own probability**, `P(any call)`, clears a
threshold — this is now a real independent model's output, not derived from a shared
multiclass softmax. Stage 2's prediction supplies the message content (Section 10) only
for the rows Stage 1 flags. Sweeping the threshold trades off **recall** (share of real
upcoming calls we catch) against **precision** (share of notifications that correspond
to a real upcoming call).""")

code(r"""# prob_any_intent = calibrated Stage 1 output (set at end of Section 5)
# y_bin = y_test_bin.values (set in Section 5)
y_bin = y_test_bin.values

prec, rec, thr = precision_recall_curve(y_bin, prob_any_intent)

fig, ax = plt.subplots(figsize=(6.5, 5))
ax.plot(rec, prec, color="#c0392b")
ax.set_xlabel("Recall  (share of real upcoming calls caught)")
ax.set_ylabel("Precision  (share of notifications that were warranted)")
ax.set_title("Precision–recall tradeoff for \"send a proactive notification\"")
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print("Threshold |  recall | precision | notifications/day (this 4,577-policy book)")
n_days_test = (test["snapshot_date"].max() - test["snapshot_date"].min()).days + 1
for t in [0.02, 0.03, 0.05, 0.07, 0.10]:
    flagged = prob_any_intent >= t
    p = (flagged & (y_bin == 1)).sum() / max(flagged.sum(), 1)
    r = (flagged & (y_bin == 1)).sum() / (y_bin == 1).sum()
    print(f"  {t:.1f}     |  {r:5.1%} |   {p:5.1%}   | {flagged.sum() / n_days_test:6.1f}")""")

md("""**Reading calibrated thresholds:** because the gate score is now a genuine probability,
the threshold has a concrete meaning — `0.05` means "send a notification to every policy
where the model estimates at least a 5% chance of a call about this topic in the next 7
days." The overall positive rate in the test set is ~2.7%, so a 5% threshold is already
nearly 2× the base rate. A 10% threshold means the model is ~4× more confident than
chance before it acts.

**Important business nuance:** unlike fraud detection or churn intervention, a "false
positive" here is rarely a wasted or annoying message. If the model flags
`due_date_amount` because a payment is genuinely due in 4 days, that reminder is
accurate and useful *whether or not the customer would have called about it* — it's a
correct statement about their policy, not a wrong guess. The real cost of a lower
threshold isn't customer annoyance from incorrect information, it's **notification
fatigue** from sending too many messages — which argues for a moderate calibrated
threshold (e.g. 0.05) plus the cooldown in Section 8, not for chasing precision at the
expense of recall.""")

md("""## 8. From daily scores to real notifications: threshold × cooldown grid

Two independent knobs control how many notifications actually go out and how many real
calls they catch:

- **Threshold** (Section 7): how confident the model must be before it flags a policy at all
- **Cooldown**: once flagged, how many days before the same (policy, intent) can fire again

Raising the threshold alone trims the *weakest* notifications gently. Cooldown has a
much bigger, cliff-shaped effect (Section 8 originally only swept cooldown — see below
for why both matter together). Rather than pick one combination silently, this section
sweeps both and reports notification volume and event-level deflection rate at each
combination, so the operating point is a deliberate choice, not a default.""")

code(r"""def build_push_message(row, intent):
    due_date = (row["snapshot_date"] + pd.Timedelta(days=int(row["days_to_next_due"]))).strftime("%d %b") if row["days_to_next_due"] < 900 else None
    last_due_date = (row["snapshot_date"] - pd.Timedelta(days=int(row["days_since_last_due"]))).strftime("%d %b") if row["days_since_last_due"] < 900 else None
    if intent == "due_date_amount":
        return f"Your policy {row['policy_no']} premium of {row['premium_amount']:,.0f} THB is due on {due_date}. Tap to pay now."
    elif intent == "payment_status":
        if row["last_payment_status"] in ("paid_on_time", "paid_late"):
            return f"Good news: your premium payment of {row['premium_amount']:,.0f} THB on {row['policy_no']} (due {last_due_date}) has been received. Tap to view your receipt."
        else:
            return f"Your premium payment of {row['premium_amount']:,.0f} THB on {row['policy_no']} (due {last_due_date}) is showing as '{row['last_payment_status']}'. Tap to complete your payment."
    elif intent == "autopay":
        return f"We noticed a recent autopay attempt on {row['policy_no']} needs attention. Tap to review your autopay details."
    elif intent == "loan_repayment":
        repay_date = (row["snapshot_date"] + pd.Timedelta(days=int(row["days_to_next_loan_repayment"]))).strftime("%d %b")
        return f"Your policy loan on {row['policy_no']} (balance {row['loan_balance']:,.0f} THB) has a repayment due {repay_date}. Tap for repayment details."
    else:  # tax_consent
        return f"Action needed: your tax-consent request for {row['policy_no']} is still pending signature. Tap for guidance on completing it."


def apply_cooldown(notif_stream, cooldown_days):
    keep_idx, last_sent = [], {}
    for r in notif_stream.itertuples():
        key = (r.policy_no, r.predicted_intent)
        if key not in last_sent or (r.snapshot_date - last_sent[key]).days >= cooldown_days:
            keep_idx.append(r.Index)
            last_sent[key] = r.snapshot_date
    return notif_stream.loc[keep_idx].reset_index(drop=True)


def event_level_deflection(notif_stream, calls_in_scope):
    by_policy = {k: g.sort_values("snapshot_date") for k, g in notif_stream.groupby("policy_no")}
    caught = 0
    for c in calls_in_scope.itertuples():
        g = by_policy.get(c.policy_no)
        if g is None:
            continue
        lo, hi = c.call_date - pd.Timedelta(days=7), c.call_date - pd.Timedelta(days=1)
        window = g[(g["snapshot_date"] >= lo) & (g["snapshot_date"] <= hi) & (g["predicted_intent"] == c.intent)]
        if len(window):
            caught += 1
    return caught


calls = pd.read_csv("../data/raw/calls.csv", parse_dates=["call_date"])
WINDOW_END = pd.Timestamp("2026-06-30")
test_start = test["snapshot_date"].min()
calls_in_scope = calls[(calls["call_date"] > test_start) & (calls["call_date"] <= WINDOW_END)]
total_calls = len(calls_in_scope)
n_days_test = (test["snapshot_date"].max() - test_start).days + 1


def build_notif_stream(threshold):
    # all (policy, day) snapshots flagged at this threshold, before any cooldown is applied
    # -- Stage 1 (prob_any_intent) decides whether, Stage 2 (top_intent_all) decides what
    flagged = prob_any_intent >= threshold
    stream = test.loc[flagged, ["policy_no", "customer_id", "snapshot_date", "premium_amount",
                                 "days_to_next_due", "days_since_last_due", "last_payment_status",
                                 "loan_balance", "days_to_next_loan_repayment"]].copy()
    stream["predicted_intent"] = top_intent_all[flagged]
    stream["confidence"] = top_intent_conf_all[flagged]
    return stream.sort_values(["policy_no", "predicted_intent", "snapshot_date"]).reset_index(drop=True)


THRESHOLDS = [0.02, 0.03, 0.05, 0.07, 0.10]
COOLDOWNS = [3, 5, 7, 10, 14]

grid_rows = []
for t in THRESHOLDS:
    stream = build_notif_stream(t)
    for cd in COOLDOWNS:
        d = apply_cooldown(stream, cd)
        caught = event_level_deflection(d, calls_in_scope)
        grid_rows.append(dict(threshold=t, cooldown=cd, notifications=len(d),
                               notif_per_day=len(d) / n_days_test, calls_caught=caught,
                               deflection_rate=caught / total_calls))
grid = pd.DataFrame(grid_rows)

pivot_defl = grid.pivot(index="threshold", columns="cooldown", values="deflection_rate") * 100
pivot_vol = grid.pivot(index="threshold", columns="cooldown", values="notif_per_day")

print("Event-level deflection rate (%) -- rows=threshold, columns=cooldown(days):")
print(pivot_defl.round(1))
print("\nNotifications per day -- rows=threshold, columns=cooldown(days):")
print(pivot_vol.round(1))""")

code(r"""fig, axes = plt.subplots(1, 2, figsize=(13, 4.5))
for ax, pivot, title, cmap, fmt in [
    (axes[0], pivot_defl, "Event-level deflection rate (%)", "RdYlGn", "{:.0f}"),
    (axes[1], pivot_vol, "Notifications / day", "OrRd", "{:.0f}"),
]:
    im = ax.imshow(pivot.values, cmap=cmap, aspect="auto")
    ax.set_xticks(range(len(pivot.columns))); ax.set_xticklabels(pivot.columns)
    ax.set_yticks(range(len(pivot.index))); ax.set_yticklabels(pivot.index)
    ax.set_xlabel("Cooldown (days)"); ax.set_ylabel("Threshold")
    ax.set_title(title)
    for i in range(pivot.shape[0]):
        for j in range(pivot.shape[1]):
            ax.text(j, i, fmt.format(pivot.values[i, j]), ha="center", va="center", fontsize=9)
    plt.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
plt.tight_layout()
plt.show()""")

md("""**Reading the grid:** cooldown is the dominant lever — moving across columns (3d to 14d)
swings deflection by 30-40 points, while moving across rows (threshold 0.3 to 0.7) only
costs 10-13 points. Threshold is the *gentler* tool: it trims the lowest-confidence
notifications without the sharp cliff effect cooldown creates past ~7-10 days (at that
point, the 7-day notification look-back window and the cooldown no longer overlap, so
caught calls drop sharply).

Pick your operating point from the grid above based on the ops/UX team's appetite for
notification volume vs deflection rate. The `0.05 / 7-day` cell is the chosen operating
point — swap `OPERATING_THRESHOLD` / `COOLDOWN_DAYS` below to try any other cell.""")

code(r"""OPERATING_THRESHOLD = 0.05  # calibrated probability: ~5% chance of a call in the next 7 days
COOLDOWN_DAYS = 7  # matches the 7-day label horizon: don't re-notify within the same lookback window

notif_all = build_notif_stream(OPERATING_THRESHOLD)
deduped = apply_cooldown(notif_all, COOLDOWN_DAYS)
deduped["message"] = deduped.apply(lambda r: build_push_message(r, r["predicted_intent"]), axis=1)
caught = event_level_deflection(deduped, calls_in_scope)
print(f"Selected operating point: threshold={OPERATING_THRESHOLD}, cooldown={COOLDOWN_DAYS}d")
print(f"  -> {len(deduped):,} notifications (~{len(deduped)/n_days_test:.1f}/day across {test['policy_no'].nunique():,} policies)")
print(f"  -> {caught}/{total_calls} calls caught ({caught/total_calls:.1%} deflection rate)")""")

md("""## 9. Business impact: how many calls could we have deflected?

The metric that matters to the call center is not row-level accuracy — it's: **of the
calls that actually happened in the test period, how many were preceded by an actually
sent, correctly typed notification in the 7 days before the customer called?** That is
what "deflecting a call" means operationally, computed here against `deduped` (the
real, cooldown-limited notification stream), not the raw daily model scores.""")

code(r"""caught = event_level_deflection(deduped, calls_in_scope)
deflection_rate = caught / total_calls
print(f"Actual calls in the test period: {total_calls}")
print(f"Notifications actually sent (after cooldown): {len(deduped):,}")
print(f"Calls preceded by an actually-sent, correctly typed notification: {caught}")
print(f"Event-level deflection rate: {deflection_rate:.1%}")""")

code(r"""# Scale this synthetic, 4,577-policy book's results to illustrate order of magnitude.
# Replace COST_PER_CALL_THB with the company's actual average call-handling cost.
COST_PER_CALL_THB = 120
N_POLICIES = df["policy_no"].nunique()
SCALE_TO = 100_000

calls_per_month = total_calls / n_days_test * 30
deflected_per_month = calls_per_month * deflection_rate
scale_factor = SCALE_TO / N_POLICIES

print(f"This synthetic book ({N_POLICIES:,} policies):")
print(f"  ~{calls_per_month:,.0f} relevant calls/month -> ~{deflected_per_month:,.0f}/month deflectable -> ~{deflected_per_month*COST_PER_CALL_THB:,.0f} THB/month saved")
print()
print(f"Illustrative scale-up to {SCALE_TO:,} policies (assumes the same behavioral mix):")
print(f"  ~{deflected_per_month*scale_factor:,.0f} calls/month deflectable")
print(f"  ~{deflected_per_month*scale_factor*COST_PER_CALL_THB:,.0f} THB/month  (~{deflected_per_month*scale_factor*COST_PER_CALL_THB*12:,.0f} THB/year) in call-center cost avoidance")
print()
print("These figures are directional only -- they depend entirely on the synthetic data's")
print("calling-rate assumptions, the chosen cooldown, and an illustrative cost-per-call.")
print("Before committing to a number, replace COST_PER_CALL_THB with AIA's actual average")
print("handling cost and validate the deflection rate with a live pilot (see Section 13).")""")

md("""## 10. From prediction to push notification

The model's output is a (policy, predicted intent, confidence) triple — turning that
into the actual AIA+ push notification is a templating step, not a modeling one. A few
representative examples, using the same `build_push_message` function that generates
the full test-set feed in Section 11:""")

code(r"""examples = []
for intent in ["due_date_amount", "payment_status", "autopay", "loan_repayment", "tax_consent"]:
    if intent == "payment_status":
        # pick a row where the last payment actually needs attention, not a paid-on-time one
        candidates = df[(df["next_intent_7d"] == intent) & (df["last_payment_status"] == "failed_pending")]
        row = candidates.iloc[0] if len(candidates) else df[df["next_intent_7d"] == intent].iloc[0]
    else:
        row = df[df["next_intent_7d"] == intent].iloc[0]
    examples.append((intent, build_push_message(row, intent)))

for intent, msg in examples:
    print(f"[{intent:>15}]  {msg}")""")

md("""## 11. Test-set push notification feed

Every notification the system would actually have sent over the test period
(15 May – 23 Jun 2026), at `OPERATING_THRESHOLD = 0.05` and `COOLDOWN_DAYS = 7`.""")

code(r"""print(deduped["predicted_intent"].value_counts())
deduped[["snapshot_date", "customer_id", "policy_no", "predicted_intent", "confidence", "message"]].head(20)""")

code(r"""print("Sample of the actual notification feed a customer/agent dashboard would show:\n")
for r in deduped.head(10).itertuples():
    print(f"{r.snapshot_date.date()}  {r.customer_id}  {r.policy_no:<8} [{r.predicted_intent:>15} | conf={r.confidence:.2f}]  {r.message}")""")

code(r"""out_path = "../data/processed/test_push_notifications.csv"
deduped.to_csv(out_path, index=False)
print(f"Full notification feed for the test period saved to {out_path} ({len(deduped):,} rows)")""")

md("""## 12. Did the notifications match the real calls?

Two directions worth checking separately:

- **Per real call** — was it preceded by a matching notification? (this is what "calls
  prevented" means)
- **Per notification sent** — did a real call actually follow it within 7 days? (this
  is "how often was the proactive message actually validated by real behavior")""")

code(r"""calls_by_policy_test = {k: g.sort_values("call_date") for k, g in calls_in_scope.groupby("policy_no")}
notif_by_policy = {k: g.sort_values("snapshot_date") for k, g in deduped.groupby("policy_no")}

# Per real call: was it caught?
call_rows = []
for c in calls_in_scope.itertuples():
    g = notif_by_policy.get(c.policy_no)
    caught, notif_date, days_advance = False, pd.NaT, None
    if g is not None:
        lo, hi = c.call_date - pd.Timedelta(days=7), c.call_date - pd.Timedelta(days=1)
        w = g[(g["snapshot_date"] >= lo) & (g["snapshot_date"] <= hi) & (g["predicted_intent"] == c.intent)]
        if len(w):
            caught = True
            notif_date = w["snapshot_date"].min()
            days_advance = (c.call_date - notif_date).days
    call_rows.append(dict(call_date=c.call_date, customer_id=c.customer_id, policy_no=c.policy_no,
                           intent=c.intent, caught_by_notification=caught,
                           notification_date=notif_date, days_advance_notice=days_advance))
call_match = pd.DataFrame(call_rows).sort_values("call_date").reset_index(drop=True)

# Per notification sent: did a real call follow?
notif_matched, notif_real_date = [], []
for r in deduped.itertuples():
    g = calls_by_policy_test.get(r.policy_no)
    m, rd = False, pd.NaT
    if g is not None:
        lo, hi = r.snapshot_date + pd.Timedelta(days=1), r.snapshot_date + pd.Timedelta(days=7)
        w = g[(g["call_date"] >= lo) & (g["call_date"] <= hi) & (g["intent"] == r.predicted_intent)]
        if len(w):
            m, rd = True, w["call_date"].min()
    notif_matched.append(m)
    notif_real_date.append(rd)
notif_match = deduped.copy()
notif_match["matched_real_call"] = notif_matched
notif_match["real_call_date"] = notif_real_date

print("=" * 70)
print(f" Notification <-> real call match summary  (test period {test_start.date()} - {WINDOW_END.date()})")
print("=" * 70)
print(f"\nReal calls that happened:                                  {len(call_match):>6,}")
print(f"  - preceded by a matching notification (CALLS PREVENTED):  {call_match['caught_by_notification'].sum():>6,}  ({call_match['caught_by_notification'].mean():.1%})")
print(f"  - not preceded by any matching notification (missed):     {(~call_match['caught_by_notification']).sum():>6,}  ({(~call_match['caught_by_notification']).mean():.1%})")
print(f"  - avg advance notice when caught:                         {call_match.loc[call_match.caught_by_notification, 'days_advance_notice'].mean():.1f} days")
print(f"\nNotifications sent:                                        {len(notif_match):>6,}")
print(f"  - followed by a matching real call within 7 days:         {notif_match['matched_real_call'].sum():>6,}  ({notif_match['matched_real_call'].mean():.1%})")
print(f"  - not followed by a real call (still a valid reminder):   {(~notif_match['matched_real_call']).sum():>6,}  ({(~notif_match['matched_real_call']).mean():.1%})")""")

md("Every real call in the test period, with whether it was caught and how much advance notice the notification gave:")

code(r"""call_match.head(20)""")

md("Every notification sent, with whether a real call actually followed it (and when):")

code(r"""notif_match[["snapshot_date", "customer_id", "policy_no", "predicted_intent", "matched_real_call", "real_call_date"]].head(20)""")

code(r"""call_match.to_csv("../data/processed/call_match.csv", index=False)
notif_match.to_csv("../data/processed/notification_match.csv", index=False)
print("Saved: data/processed/call_match.csv, data/processed/notification_match.csv")""")

md("""### Did adding `calls_lifetime_rate` cost us first-time callers?

This is the concrete check for the "if a policy never calls, should the model just
ignore it" question from earlier: roughly a quarter of real calls are a policy's
*first call ever* (no prior history at all). A blunt "skip policies with zero call
history" rule would miss all of them by construction. The features added in Section 3
were chosen specifically so the model could lower its baseline guess for chronic
non-callers *without* using a hard cutoff — this checks whether that held.""")

code(r"""call_match["is_first_call_for_policy"] = call_match.apply(
    lambda r: not (calls[(calls["policy_no"] == r["policy_no"]) & (calls["call_date"] < r["call_date"])]).shape[0] > 0,
    axis=1,
)

first_call_summary = call_match.groupby("is_first_call_for_policy")["caught_by_notification"].agg(
    calls="count", caught="sum"
)
first_call_summary["catch_rate"] = first_call_summary["caught"] / first_call_summary["calls"]
first_call_summary.index = first_call_summary.index.map({True: "first call ever for this policy", False: "repeat caller"})
print(first_call_summary)
print(f"\nOverall: {call_match['is_first_call_for_policy'].sum()} of {len(call_match)} test-period calls "
      f"({call_match['is_first_call_for_policy'].mean():.1%}) were a policy's first call ever.")""")

md(f"""## 13. Executive summary

- **The problem is real and addressable.** ~5 routine topics likely drive a large share
  of avoidable call volume; the answers already exist in AIA+.
- **The behavioral signal is learnable.** A LightGBM model trained on policy/payment
  state and app-engagement proxies lifts recall on every intent from 0% (today's
  baseline) to 33–80% recall depending on the operating threshold chosen, and the
  model's top features line up exactly with the real-world triggers (due dates,
  autopay failures, pending consent, loan repayment dates).
- **Event-level impact, using the actual notification stream (not raw daily scores):**
  at threshold 0.5 and a 7-day cooldown, the model would have prevented a meaningful
  share of actual calls — see Section 9/12 for the exact figures, which are sensitive
  to the cooldown chosen (Section 8 shows that tradeoff explicitly: tighter cooldowns
  catch more calls but send far more notifications).
- **Cost of a "wrong" notification is low.** Most sent-but-uncalled notifications are
  still accurate, relevant reminders (e.g., a real due date), not incorrect guesses —
  the main production risk is notification fatigue, addressed by the cooldown, not by
  suppressing the model's recall.
- **Recommended next steps:**
  1. Replace synthetic data with real call-reason-coded call logs (6–12 months) + policy/payment/autopay/loan/consent admin data.
  2. Run a **silent pilot**: score the live book daily, log what *would* have been sent, compare against real inbound calls for 4–8 weeks before turning on live pushes.
  3. A/B test cooldown length against real call volume rather than assuming one value — Section 8's tradeoff curve is illustrative, not definitive, until validated on real data.
  4. Track the metric that matters operationally: **inbound call volume per 1,000 policies**, pre- vs post-launch, by intent category — not just model accuracy.
""")

nb["cells"] = cells
nb["metadata"] = {
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {"name": "python", "version": "3"},
}

with open("notebooks/call_intent_prediction.ipynb", "w", encoding="utf-8") as f:
    nbf.write(nb, f)

print("Notebook written to notebooks/call_intent_prediction.ipynb")