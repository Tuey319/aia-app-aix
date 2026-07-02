"""
Trains the two-stage call-intent model (same architecture as
notebooks/call_intent_prediction.ipynb, minus Optuna HPO -- fixed, reasonable
hyperparameters instead, since this script's job is to produce a servable
artifact quickly, not to squeeze out the last bit of accuracy) and exports
two things a backend service can consume without needing Python/LightGBM
installed at request time:

1. data/processed/models/  -- joblib-persisted gate model, intent model,
   isotonic calibrator, and the feature list, for anyone who *does* want to
   re-score from Python later (e.g. a nightly batch job).
2. data/processed/live_notifications.json -- the actual notification feed a
   backend/app would show *today*: every policy scored on the most recent
   available snapshot date, filtered by the calibrated operating threshold
   and de-duplicated with the cooldown window, exactly as in Section 8-11 of
   the notebook. This is the file the Node prototype service reads.

Run: python src/train_and_export.py
"""
import json
import os
import uuid

import joblib
import numpy as np
import pandas as pd
from lightgbm import LGBMClassifier
from sklearn.isotonic import IsotonicRegression

PROC_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
MODELS_DIR = os.path.join(PROC_DIR, "models")
RAW_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
os.makedirs(MODELS_DIR, exist_ok=True)

RANDOM_STATE = 42
OPERATING_THRESHOLD = 0.05  # calibrated probability: matches FUTURE_PLAN.md v1.0 operating point
COOLDOWN_DAYS = 7
SCORING_WINDOW_DAYS = 14  # score the last N available days so cooldown has history to dedupe against

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

# fixed hyperparameters (roughly the ballpark Optuna converges to in the notebook's HPO
# sweep) -- good enough for a servable prototype without paying for a tuning run here.
GATE_PARAMS = dict(
    objective="binary", num_leaves=48, min_child_samples=30, learning_rate=0.05,
    n_estimators=350, reg_alpha=0.1, reg_lambda=0.1, colsample_bytree=0.8, subsample=0.8,
    class_weight="balanced", random_state=RANDOM_STATE, verbose=-1,
)
INTENT_PARAMS = dict(
    objective="multiclass", num_leaves=48, min_child_samples=20, learning_rate=0.05,
    n_estimators=350, reg_alpha=0.1, reg_lambda=0.1, colsample_bytree=0.8, subsample=0.8,
    class_weight="balanced", random_state=RANDOM_STATE, verbose=-1,
)


def add_derived_features(df):
    df["call_trend"] = df["calls_30d_total"] / (df["calls_90d_total"] + 1)
    risk = df[["customer_id", "snapshot_date", "days_since_autopay_fail", "days_to_next_due"]].copy()
    risk["_ap"] = (risk["days_since_autopay_fail"] < 30).astype(int)
    risk["_due"] = (risk["days_to_next_due"] < 14).astype(int)
    agg = (risk.groupby(["customer_id", "snapshot_date"])[["_ap", "_due"]]
           .sum()
           .rename(columns={"_ap": "cust_policies_autopay_risk", "_due": "cust_policies_due_soon"})
           .reset_index())
    return df.merge(agg, on=["customer_id", "snapshot_date"], how="left")


def build_push_message(row, intent):
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


def apply_cooldown(stream, cooldown_days):
    keep_idx, last_sent = [], {}
    for r in stream.itertuples():
        key = (r.policy_no, r.predicted_intent)
        if key not in last_sent or (r.snapshot_date - last_sent[key]).days >= cooldown_days:
            keep_idx.append(r.Index)
            last_sent[key] = r.snapshot_date
    return stream.loc[keep_idx].reset_index(drop=True)


def main():
    print("Loading modeling dataset...")
    df = pd.read_parquet(os.path.join(PROC_DIR, "model_dataset.parquet"))
    df = add_derived_features(df)
    for c in CAT_COLS:
        df[c] = df[c].astype("category")
    for c in BOOL_COLS:
        df[c] = df[c].astype(int)

    max_date = df["snapshot_date"].max()
    # hold out the last 6 weeks for calibration, matching the notebook's time-based split
    train_end = max_date - pd.Timedelta(days=40)
    cal_start = train_end - pd.Timedelta(days=30)

    train = df[df["snapshot_date"] <= train_end]
    cal = df[(df["snapshot_date"] > cal_start) & (df["snapshot_date"] <= train_end)]

    X_train, y_train = train[FEATURES], train[LABEL]
    y_train_bin = (y_train != "no_call").astype(int)

    print(f"Training gate model on {len(train):,} rows (through {train_end.date()})...")
    clf_gate = LGBMClassifier(**GATE_PARAMS)
    clf_gate.fit(X_train, y_train_bin, categorical_feature=CAT_COLS)

    print("Calibrating gate probabilities (isotonic regression)...")
    X_cal, y_cal_bin = cal[FEATURES], (cal[LABEL] != "no_call").astype(int)
    cal_raw = clf_gate.predict_proba(X_cal)[:, 1]
    iso_cal = IsotonicRegression(out_of_bounds="clip").fit(cal_raw, y_cal_bin)

    print("Training intent model...")
    train_pos = train[train[LABEL] != "no_call"]
    clf_intent = LGBMClassifier(**INTENT_PARAMS)
    clf_intent.fit(train_pos[FEATURES], train_pos[LABEL], categorical_feature=CAT_COLS)

    print(f"Persisting models to {os.path.abspath(MODELS_DIR)}...")
    joblib.dump(clf_gate, os.path.join(MODELS_DIR, "gate_model.joblib"))
    joblib.dump(clf_intent, os.path.join(MODELS_DIR, "intent_model.joblib"))
    joblib.dump(iso_cal, os.path.join(MODELS_DIR, "gate_calibrator.joblib"))
    with open(os.path.join(MODELS_DIR, "feature_config.json"), "w") as f:
        json.dump({
            "features": FEATURES, "cat_cols": CAT_COLS, "bool_cols": BOOL_COLS,
            "operating_threshold": OPERATING_THRESHOLD, "cooldown_days": COOLDOWN_DAYS,
        }, f, indent=2)

    # --- score the most recent window as "today", to produce a live notification feed ---
    score_start = max_date - pd.Timedelta(days=SCORING_WINDOW_DAYS - 1)
    scoring = df[df["snapshot_date"] >= score_start].copy()
    print(f"Scoring {len(scoring):,} (policy, day) rows from {score_start.date()} -> {max_date.date()} "
          f"as the 'live' window (today = {max_date.date()})...")

    X_score = scoring[FEATURES]
    gate_raw = clf_gate.predict_proba(X_score)[:, 1]
    gate_cal = iso_cal.predict(gate_raw)
    intent_proba = clf_intent.predict_proba(X_score)
    intent_classes = clf_intent.classes_
    top_intent = intent_classes[np.argmax(intent_proba, axis=1)]
    top_conf = intent_proba.max(axis=1)

    flagged = gate_cal >= OPERATING_THRESHOLD
    stream = scoring.loc[flagged, ["policy_no", "customer_id", "snapshot_date", "premium_amount",
                                    "days_to_next_due", "days_since_last_due", "last_payment_status",
                                    "loan_balance", "days_to_next_loan_repayment", "product_type"]].copy()
    stream["predicted_intent"] = top_intent[flagged]
    stream["confidence"] = top_conf[flagged]
    stream = stream.sort_values(["policy_no", "predicted_intent", "snapshot_date"]).reset_index(drop=True)

    deduped = apply_cooldown(stream, COOLDOWN_DAYS)
    # keep only the most recent notification per (policy, intent) -- that's what's "currently active" today
    deduped = deduped.sort_values("snapshot_date").groupby(["policy_no", "predicted_intent"], as_index=False).tail(1)
    deduped["message"] = deduped.apply(lambda r: build_push_message(r, r["predicted_intent"]), axis=1)
    deduped = deduped.sort_values("snapshot_date", ascending=False).reset_index(drop=True)

    print(f"Live notification feed: {len(deduped):,} active notifications across "
          f"{deduped['policy_no'].nunique():,} policies / {deduped['customer_id'].nunique():,} customers.")

    def iso_date_or_none(base_date, day_offset):
        if day_offset is None or day_offset >= 900:
            return None
        return (base_date + pd.Timedelta(days=int(day_offset))).strftime("%Y-%m-%d")

    now_iso = pd.Timestamp.now("UTC").isoformat()
    records = []
    for r in deduped.itertuples():
        records.append({
            "id": str(uuid.uuid4()),
            "customerId": r.customer_id,
            "policyNo": r.policy_no,
            "productType": r.product_type,
            "intent": r.predicted_intent,
            "message": r.message,
            "confidence": round(float(r.confidence), 4),
            "snapshotDate": r.snapshot_date.strftime("%Y-%m-%d"),
            "premiumAmount": float(r.premium_amount),
            "lastPaymentStatus": r.last_payment_status,
            "loanBalance": float(r.loan_balance),
            "dueDate": iso_date_or_none(r.snapshot_date, r.days_to_next_due),
            "lastDueDate": iso_date_or_none(r.snapshot_date, -r.days_since_last_due if r.days_since_last_due < 900 else None),
            "loanRepaymentDate": iso_date_or_none(r.snapshot_date, r.days_to_next_loan_repayment),
            "createdAt": now_iso,
            "read": False,
            "dismissed": False,
        })

    out_path = os.path.join(PROC_DIR, "live_notifications.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    print(f"Written to {os.path.abspath(out_path)}")


if __name__ == "__main__":
    main()
