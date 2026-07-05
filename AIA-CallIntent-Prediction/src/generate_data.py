"""
Synthetic data generator for the "Proactive Call-Intent Prediction" project.

Simulates 8 months of AIA+ backend data (customers, policies, premium due/payment
history, autopay events, policy loans, tax-consent lifecycle, app logins) for a
synthetic book of ~3,000 customers, plus the call-center history that results from
their behavior. Calls are NOT random labels bolted on after the fact -- each call is
generated from a behavioral trigger (an approaching due date, a failed autopay debit,
a pending consent, an upcoming loan repayment) with realistic probabilities, modulated
by each customer's latent "digital engagement" level (low-engagement customers are far
more likely to call instead of self-serving in the app). A small amount of spontaneous,
untriggered calling is added so the resulting dataset is not perfectly separable.

Run: python src/generate_data.py
Output: data/raw/*.csv
"""
import os
import numpy as np
import pandas as pd

SEED = 42
rng = np.random.default_rng(SEED)

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
os.makedirs(OUT_DIR, exist_ok=True)

# "Today". The 6-month call-history window we train on is [WINDOW_START, WINDOW_END].
WINDOW_END = pd.Timestamp("2026-06-30")
WINDOW_START = WINDOW_END - pd.DateOffset(months=6) + pd.Timedelta(days=1)  # 2026-01-01
SCHEDULE_START = WINDOW_START - pd.DateOffset(months=3)   # extra history for "days since last due" etc.
SCHEDULE_END = WINDOW_END + pd.Timedelta(days=20)          # known future due dates (premium schedules are pre-set)

N_CUSTOMERS = 3000

PRODUCTS = {
    "Whole Life":      (2000, 15000),
    "Endowment":       (3000, 12000),
    "Term Life":       (500, 3000),
    "Unit Linked":     (3000, 20000),
    "Health Rider":    (300, 2000),
    "Personal Accident": (200, 1000),
}
PRODUCT_NAMES = list(PRODUCTS.keys())
PRODUCT_WEIGHTS = [0.18, 0.12, 0.22, 0.13, 0.25, 0.10]

FREQ_DAYS = {"monthly": 30, "quarterly": 91, "semi-annual": 182, "annual": 365}
FREQ_NAMES = list(FREQ_DAYS.keys())
FREQ_WEIGHTS = [0.40, 0.20, 0.15, 0.25]

ENGAGEMENT_LEVELS = ["low", "medium", "high"]
ENGAGEMENT_WEIGHTS = [0.35, 0.45, 0.20]
# expected app logins per 30 days, by engagement level
LOGIN_RATE_PER_MONTH = {"low": 0.5, "medium": 4.0, "high": 12.0}
APP_REGISTERED_PROB = {"low": 0.55, "medium": 0.90, "high": 0.99}
AUTOPAY_ENROLL_PROB = {"low": 0.25, "medium": 0.45, "high": 0.65}

INTENTS = ["due_date_amount", "payment_status", "autopay", "loan_repayment", "tax_consent"]


def gen_customers(n):
    customer_id = [f"C{100000+i}" for i in range(n)]
    age = np.clip(rng.normal(40, 12, n), 20, 78).round().astype(int)
    gender = rng.choice(["M", "F"], n)
    tenure_years = np.clip(rng.normal(6, 4, n) + age * 0.02, 0.3, 22).round(1)
    engagement = rng.choice(ENGAGEMENT_LEVELS, n, p=ENGAGEMENT_WEIGHTS)
    app_registered = np.array([rng.random() < APP_REGISTERED_PROB[e] for e in engagement])
    num_policies = rng.choice([1, 2, 3], n, p=[0.60, 0.30, 0.10])
    preferred_channel = np.where(
        ~app_registered, "call",
        np.where(engagement == "high", "app", rng.choice(["app", "call"], n, p=[0.6, 0.4]))
    )
    return pd.DataFrame({
        "customer_id": customer_id, "age": age, "gender": gender,
        "tenure_years": tenure_years, "engagement_level": engagement,
        "app_registered": app_registered, "num_policies": num_policies,
        "preferred_channel": preferred_channel,
    })


def gen_policies(customers):
    rows = []
    policy_seq = 1000000000
    for c in customers.itertuples():
        for _ in range(c.num_policies):
            policy_seq += 1
            product = rng.choice(PRODUCT_NAMES, p=PRODUCT_WEIGHTS)
            lo, hi = PRODUCTS[product]
            premium = round(rng.uniform(lo, hi) / 50) * 50
            freq = rng.choice(FREQ_NAMES, p=FREQ_WEIGHTS)
            max_age_days = int(min(c.tenure_years, 20) * 365)
            start_offset = int(rng.uniform(0.2, 1.0) * max_age_days) if max_age_days > 30 else int(rng.uniform(30, 365))
            policy_start = WINDOW_START - pd.Timedelta(days=start_offset)
            autopay_p = AUTOPAY_ENROLL_PROB[c.engagement_level]
            autopay_enrolled = rng.random() < autopay_p
            autopay_method = rng.choice(["bank_debit", "credit_card"], p=[0.55, 0.45]) if autopay_enrolled else None
            requires_tax = bool(autopay_method == "bank_debit") or (rng.random() < 0.08)
            policy_age_years = (WINDOW_START - policy_start).days / 365
            has_loan = product in ("Whole Life", "Endowment") and policy_age_years > 3 and rng.random() < 0.18
            rows.append({
                "policy_no": f"T{policy_seq}", "customer_id": c.customer_id,
                "product_type": product, "premium_amount": premium,
                "premium_frequency": freq, "policy_start_date": policy_start,
                "autopay_enrolled": autopay_enrolled, "autopay_method": autopay_method,
                "requires_tax_consent": requires_tax, "has_loan": has_loan,
            })
    return pd.DataFrame(rows)


def due_dates_for_policy(start_date, freq):
    step = pd.Timedelta(days=FREQ_DAYS[freq])
    dates = []
    d = start_date
    while d <= SCHEDULE_END:
        dates.append(d)
        d += step
    # bound list size for long-tenure policies, but always keep at least one cycle
    # before SCHEDULE_START so "days since last due" is computable at window start
    cutoff = SCHEDULE_START - step
    filtered = [dd for dd in dates if dd >= cutoff]
    return filtered if filtered else [dates[-1]]


def gen_payments_and_autopay(policies):
    payment_rows, autopay_rows = [], []
    pay_id, ap_id = 0, 0
    for p in policies.itertuples():
        dues = due_dates_for_policy(p.policy_start_date, p.premium_frequency)
        for due in dues:
            pay_id += 1
            is_future = due > WINDOW_END
            if is_future:
                payment_rows.append({
                    "payment_id": f"PMT{pay_id}", "policy_no": p.policy_no, "due_date": due,
                    "amount_due": p.premium_amount, "status": "upcoming", "paid_date": pd.NaT,
                })
                continue

            if p.autopay_enrolled:
                ap_id += 1
                success_1 = rng.random() < 0.88
                if success_1:
                    payment_rows.append({"payment_id": f"PMT{pay_id}", "policy_no": p.policy_no, "due_date": due,
                                          "amount_due": p.premium_amount, "status": "paid_on_time", "paid_date": due})
                    autopay_rows.append({"event_id": f"AP{ap_id}", "policy_no": p.policy_no, "event_date": due,
                                          "event_type": "attempt_success", "reason_failed": None})
                else:
                    fail_reason = rng.choice(["insufficient_funds", "card_expired", "bank_declined"], p=[0.55, 0.25, 0.20])
                    autopay_rows.append({"event_id": f"AP{ap_id}", "policy_no": p.policy_no, "event_date": due,
                                          "event_type": "attempt_failed", "reason_failed": fail_reason})
                    retry_date = due + pd.Timedelta(days=3)
                    ap_id += 1
                    if retry_date <= WINDOW_END and rng.random() < 0.70:
                        payment_rows.append({"payment_id": f"PMT{pay_id}", "policy_no": p.policy_no, "due_date": due,
                                              "amount_due": p.premium_amount, "status": "paid_late", "paid_date": retry_date})
                        autopay_rows.append({"event_id": f"AP{ap_id}", "policy_no": p.policy_no, "event_date": retry_date,
                                              "event_type": "attempt_success", "reason_failed": None})
                    else:
                        payment_rows.append({"payment_id": f"PMT{pay_id}", "policy_no": p.policy_no, "due_date": due,
                                              "amount_due": p.premium_amount, "status": "failed_pending", "paid_date": pd.NaT})
                        autopay_rows.append({"event_id": f"AP{ap_id}", "policy_no": p.policy_no, "event_date": retry_date,
                                              "event_type": "attempt_failed", "reason_failed": fail_reason})
            else:
                roll = rng.random()
                if roll < 0.70:
                    delay = rng.integers(0, 3)
                    status = "paid_on_time"
                elif roll < 0.90:
                    delay = rng.integers(3, 8)
                    status = "paid_late"
                elif roll < 0.97:
                    delay = rng.integers(8, 15)
                    status = "paid_late"
                else:
                    delay = None
                    status = "failed_pending"
                paid_date = due + pd.Timedelta(days=int(delay)) if delay is not None else pd.NaT
                if paid_date is not pd.NaT and paid_date is not None and not pd.isna(paid_date) and paid_date > WINDOW_END:
                    status, paid_date = "pending", pd.NaT
                payment_rows.append({"payment_id": f"PMT{pay_id}", "policy_no": p.policy_no, "due_date": due,
                                      "amount_due": p.premium_amount, "status": status, "paid_date": paid_date})
    return pd.DataFrame(payment_rows), pd.DataFrame(autopay_rows)


def gen_loans(policies):
    loan_rows, repay_rows = [], []
    repay_id = 0
    loan_policies = policies[policies["has_loan"]]
    for p in loan_policies.itertuples():
        loan_balance = round(rng.uniform(5000, 100000) / 500) * 500
        freq = rng.choice(["monthly", "quarterly"], p=[0.6, 0.4])
        min_repay = round(loan_balance * rng.uniform(0.03, 0.08) / 50) * 50
        loan_rows.append({
            "loan_id": f"LN{p.Index}", "policy_no": p.policy_no, "loan_balance": loan_balance,
            "repayment_frequency": freq, "min_repayment_amount": min_repay,
        })
        for due in due_dates_for_policy(WINDOW_START - pd.DateOffset(months=2), freq):
            repay_id += 1
            is_future = due > WINDOW_END
            if is_future:
                repay_rows.append({"repayment_id": f"RP{repay_id}", "policy_no": p.policy_no,
                                    "due_date": due, "status": "upcoming"})
                continue
            paid = rng.random() < 0.75
            repay_rows.append({"repayment_id": f"RP{repay_id}", "policy_no": p.policy_no,
                                "due_date": due, "status": "paid" if paid else "missed"})
    return pd.DataFrame(loan_rows), pd.DataFrame(repay_rows)


def gen_tax_consent(policies):
    rows = []
    req = policies[policies["requires_tax_consent"]]
    for i, p in enumerate(req.itertuples()):
        start_lo = max(p.policy_start_date, SCHEDULE_START)
        start_hi = WINDOW_END - pd.Timedelta(days=1)
        if start_hi <= start_lo:
            start = start_lo
        else:
            start = start_lo + pd.Timedelta(days=int(rng.integers(0, (start_hi - start_lo).days)))
        roll = rng.random()
        if roll < 0.60:
            resolve_days = int(rng.integers(1, 14))
            resolve_date = start + pd.Timedelta(days=resolve_days)
            status = "active" if resolve_date <= WINDOW_END else "pending_signature"
        elif roll < 0.85:
            status = "pending_signature"
            resolve_date = pd.NaT
        else:
            status = "expired"
            resolve_date = start + pd.Timedelta(days=30)
        rows.append({
            "consent_id": f"TAX{i+1}", "policy_no": p.policy_no, "request_date": start,
            "status": status, "status_date": resolve_date if not pd.isna(resolve_date) else start,
        })
    return pd.DataFrame(rows)


def gen_app_logins(customers):
    rows = []
    days_in_window = (WINDOW_END - SCHEDULE_START).days
    for c in customers.itertuples():
        if not c.app_registered:
            continue
        rate_per_day = LOGIN_RATE_PER_MONTH[c.engagement_level] / 30.0
        n_logins = rng.poisson(rate_per_day * days_in_window)
        if n_logins == 0:
            continue
        offsets = rng.integers(0, days_in_window, size=n_logins)
        for off in offsets:
            rows.append({"customer_id": c.customer_id, "login_date": SCHEDULE_START + pd.Timedelta(days=int(off))})
    return pd.DataFrame(rows)


def triangular_offset(low, mode, high):
    return int(round(rng.triangular(low, mode, high)))


def gen_calls(customers, policies, payments, autopay, loans, repayments, tax_consent):
    cust_eng = customers.set_index("customer_id")["engagement_level"].to_dict()
    cust_pref = customers.set_index("customer_id")["preferred_channel"].to_dict()
    eng_due_base = {"low": 0.20, "medium": 0.09, "high": 0.035}
    eng_status_base = {"low": 1.0, "medium": 0.6, "high": 0.35}  # multiplier
    eng_loan_base = {"low": 0.16, "medium": 0.10, "high": 0.05}
    eng_tax_base = {"low": 0.42, "medium": 0.30, "high": 0.18}

    rows = []
    call_seq = 0

    def add_call(customer_id, policy_no, date, intent):
        nonlocal call_seq
        if date < SCHEDULE_START or date > WINDOW_END:
            return
        call_seq += 1
        rows.append({"call_id": f"CL{call_seq}", "customer_id": customer_id, "policy_no": policy_no,
                     "call_date": date, "intent": intent})

    pol_to_cust = policies.set_index("policy_no")["customer_id"].to_dict()
    pol_autopay = policies.set_index("policy_no")["autopay_enrolled"].to_dict()
    pol_premium = policies.set_index("policy_no")["premium_amount"].to_dict()

    # 1+2: due_date_amount & payment_status calls, from the payment schedule
    for pmt in payments.itertuples():
        policy_no = pmt.policy_no
        cust = pol_to_cust[policy_no]
        eng = cust_eng[cust]
        autopay_on = pol_autopay[policy_no]
        premium = pol_premium[policy_no]

        # anticipatory "when/how much is due" calls (suppressed by autopay)
        prob_due = eng_due_base[eng] * (0.30 if autopay_on else 1.0) * (1.0 + min(premium, 10000) / 20000)
        if rng.random() < prob_due:
            offset = triangular_offset(1, 4, 10)
            add_call(cust, policy_no, pmt.due_date - pd.Timedelta(days=offset), "due_date_amount")

        # post-due "did it go through / how much do I owe" calls
        if pmt.status == "upcoming":
            continue
        status_mult = {"paid_on_time": 0.04, "paid_late": 0.28, "failed_pending": 0.60, "pending": 0.50}.get(pmt.status, 0.05)
        prob_status = status_mult * eng_status_base[eng]
        if rng.random() < prob_status:
            offset = triangular_offset(0, 1, 7)
            add_call(cust, policy_no, pmt.due_date + pd.Timedelta(days=offset), "payment_status")

    # 3: autopay calls, triggered by failed attempts
    for ev in autopay.itertuples():
        if ev.event_type != "attempt_failed":
            continue
        cust = pol_to_cust[ev.policy_no]
        eng = cust_eng[cust]
        prob = 0.55 if eng == "low" else (0.42 if eng == "medium" else 0.30)
        if rng.random() < prob:
            offset = triangular_offset(0, 1, 5)
            add_call(cust, ev.policy_no, ev.event_date + pd.Timedelta(days=offset), "autopay")

    # 4: loan_repayment calls, from the loan repayment schedule
    loan_balance_map = loans.set_index("policy_no")["loan_balance"].to_dict()
    for rp in repayments.itertuples():
        if rp.status == "upcoming":
            continue
        cust = pol_to_cust[rp.policy_no]
        eng = cust_eng[cust]
        balance = loan_balance_map.get(rp.policy_no, 20000)
        prob = eng_loan_base[eng] * (0.6 + min(balance, 100000) / 100000)
        if rng.random() < prob:
            offset = triangular_offset(-7, -2, 3)
            add_call(cust, rp.policy_no, rp.due_date + pd.Timedelta(days=offset), "loan_repayment")

    # 4b: anticipatory loan calls near *future* repayments too (within window)
    future_repay = repayments[repayments["status"] == "upcoming"]
    for rp in future_repay.itertuples():
        if rp.due_date - pd.Timedelta(days=10) > WINDOW_END:
            continue
        cust = pol_to_cust[rp.policy_no]
        eng = cust_eng[cust]
        balance = loan_balance_map.get(rp.policy_no, 20000)
        prob = eng_loan_base[eng] * (0.6 + min(balance, 100000) / 100000)
        if rng.random() < prob:
            offset = triangular_offset(-7, -2, 3)
            add_call(cust, rp.policy_no, rp.due_date + pd.Timedelta(days=offset), "loan_repayment")

    # 5: tax_consent calls, while pending / after expiry
    for t in tax_consent.itertuples():
        cust = pol_to_cust[t.policy_no]
        eng = cust_eng[cust]
        base = eng_tax_base[eng]
        if t.status == "pending_signature":
            window_lo, window_hi = t.request_date + pd.Timedelta(days=3), t.request_date + pd.Timedelta(days=25)
            if rng.random() < base:
                add_call(cust, t.policy_no, window_lo + pd.Timedelta(days=int(rng.integers(0, max((window_hi - window_lo).days, 1)))), "tax_consent")
            if rng.random() < base * 0.5:
                add_call(cust, t.policy_no, window_hi, "tax_consent")
        elif t.status == "expired":
            n_followups = rng.integers(0, 3)
            for _ in range(n_followups):
                d = t.status_date + pd.Timedelta(days=int(rng.integers(5, 90)))
                if rng.random() < base * 0.5:
                    add_call(cust, t.policy_no, d, "tax_consent")
        else:  # active, resolved smoothly -> small chance of a one-off question while pending earlier
            if rng.random() < base * 0.15:
                add_call(cust, t.policy_no, t.request_date + pd.Timedelta(days=int(rng.integers(1, 8))), "tax_consent")

    # spontaneous / untriggered noise calls, ~unexplainable by simple rules
    all_policy_nos = policies["policy_no"].values
    n_days = (WINDOW_END - SCHEDULE_START).days
    n_noise = int(len(all_policy_nos) * n_days * 0.00012)
    noise_idx = rng.integers(0, len(all_policy_nos), n_noise)
    for idx in noise_idx:
        policy_no = all_policy_nos[idx]
        cust = pol_to_cust[policy_no]
        d = SCHEDULE_START + pd.Timedelta(days=int(rng.integers(0, n_days)))
        intent = rng.choice(INTENTS)
        add_call(cust, policy_no, d, intent)

    calls = pd.DataFrame(rows)
    calls["call_date"] = pd.to_datetime(calls["call_date"])
    calls = calls.sort_values(["policy_no", "call_date"]).reset_index(drop=True)
    return calls


def main():
    print("Generating customers...")
    customers = gen_customers(N_CUSTOMERS)
    print("Generating policies...")
    policies = gen_policies(customers)
    print(f"  -> {len(policies)} policies across {N_CUSTOMERS} customers")
    print("Generating payments & autopay events...")
    payments, autopay = gen_payments_and_autopay(policies)
    print("Generating loans & repayments...")
    loans, repayments = gen_loans(policies)
    print("Generating tax consent records...")
    tax_consent = gen_tax_consent(policies)
    print("Generating app login events...")
    logins = gen_app_logins(customers)
    print("Generating call-center history from behavioral triggers...")
    calls = gen_calls(customers, policies, payments, autopay, loans, repayments, tax_consent)
    print(f"  -> {len(calls)} historical calls generated")

    customers.to_csv(os.path.join(OUT_DIR, "customers.csv"), index=False)
    policies.to_csv(os.path.join(OUT_DIR, "policies.csv"), index=False)
    payments.to_csv(os.path.join(OUT_DIR, "payments.csv"), index=False)
    autopay.to_csv(os.path.join(OUT_DIR, "autopay_events.csv"), index=False)
    loans.to_csv(os.path.join(OUT_DIR, "loans.csv"), index=False)
    repayments.to_csv(os.path.join(OUT_DIR, "loan_repayments.csv"), index=False)
    tax_consent.to_csv(os.path.join(OUT_DIR, "tax_consent.csv"), index=False)
    logins.to_csv(os.path.join(OUT_DIR, "app_logins.csv"), index=False)
    calls.to_csv(os.path.join(OUT_DIR, "calls.csv"), index=False)

    print("\nIntent distribution in generated call history:")
    print(calls["intent"].value_counts())
    print(f"\nAll raw tables written to {os.path.abspath(OUT_DIR)}")


if __name__ == "__main__":
    main()