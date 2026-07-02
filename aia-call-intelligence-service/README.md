# aia-call-intelligence-service

Prototype backend that serves the **proactive call-intent notification feed**
produced by [`AIA-CallIntent-Prediction`](../AIA-CallIntent-Prediction) to the
AIA+ app. This is what lets the app push "we noticed your autopay failed" /
"your premium is due in 4 days" style notifications *before* the customer
calls the call center, instead of the app having no way to know that.

## How it fits together

```
AIA-CallIntent-Prediction (Python/LightGBM)
  -> trains the two-stage call-intent model
  -> scores the current book of policies
  -> writes data/processed/live_notifications.json
                    |
                    v  (copied in)
aia-call-intelligence-service (this repo, Node/TypeScript)
  -> loads that feed into memory
  -> serves it over a small REST API
                    |
                    v
aia-app (Expo/React Native)
  -> fetches /api/notifications?customerId=... on load
  -> shows in-app notifications / badges
```

This is deliberately a **prototype, not the production design**: the model
runs offline and hands off a static JSON feed rather than scoring on live
policy/payment data in real time. See "Path to production" below for what
changes when this graduates past a demo.

## Running it

```
npm install
npm run dev      # http://localhost:4001, auto-reloads on save
```

`data/notifications.json` ships pre-seeded (copied from the ML project's
latest export) so the service runs standalone — nobody needs a Python/LightGBM
environment just to develop against the API. To reset back to the seed after
testing mutations (`/read`, `/dismiss`):

```
npm run reset-data
```

## Deploying (Railway / Render)

A multi-stage `Dockerfile` is included and builds/runs clean (verified locally
with `docker build . && docker run`). Both Railway and Render auto-detect a
root-level `Dockerfile` — no extra config needed beyond pointing a new service
at this repo/folder.

- **Port**: both platforms inject `PORT` at runtime; `server.ts` already reads
  `process.env.PORT`, so nothing to configure there.
- **Data persistence**: the container has no persistent disk — `data/notifications.json`
  (the mutable copy `read`/`dismiss` write to) only exists if it was baked
  into the image at build time from a git-tracked file, and resets to
  `data/notifications.seed.json` on every redeploy/restart. That's fine for a
  prototype; a real deployment needs a real database (see "Path to
  production" below).
- **CORS** is wide open (`app.use(cors())`) so the Expo app can call it from
  any origin during development — tighten this before it's public.
- Once deployed, point the app's `EXPO_PUBLIC_NOTIFICATIONS_URL` (in
  `aia-app/.env`) at the deployed URL instead of a LAN IP — no app code
  changes needed either way.

Local Docker smoke test, if you want to reproduce it:

```
docker build -t aia-call-intelligence-service .
docker run -p 4001:4001 -e PORT=4001 aia-call-intelligence-service
curl http://localhost:4001/health
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/api/notifications` | All active (non-dismissed) notifications |
| GET | `/api/notifications?customerId=C102221` | Active notifications for one customer |
| GET | `/api/notifications?policyNo=T13392` | Active notifications for one policy |
| GET | `/api/notifications?...&includeDismissed=true` | Include dismissed ones too |
| POST | `/api/notifications/:id/read` | Mark a notification as read |
| POST | `/api/notifications/:id/dismiss` | Dismiss a notification (hidden from default list) |

Notification shape:

```ts
{
  id: string;
  customerId: string;
  policyNo: string;
  intent: "due_date_amount" | "payment_status" | "autopay" | "loan_repayment" | "tax_consent";
  message: string;       // ready-to-display push copy
  confidence: number;    // calibrated probability, 0-1
  snapshotDate: string;  // "YYYY-MM-DD", the day the model scored this
  createdAt: string;     // ISO timestamp
  read: boolean;
  dismissed: boolean;
}
```

## Integrating from `aia-app`

The app has no backend calls today besides the Groq chatbot
([`src/api/assistant.ts`](../aia-app/src/api/assistant.ts)) — this would be
the first. A matching `src/api/notifications.ts` in `aia-app` would look like:

```ts
const NOTIFICATIONS_BASE_URL = process.env.EXPO_PUBLIC_NOTIFICATIONS_URL; // e.g. http://localhost:4001

export async function fetchNotifications(customerId: string) {
  const res = await fetch(`${NOTIFICATIONS_BASE_URL}/api/notifications?customerId=${customerId}`);
  if (!res.ok) throw new Error(`Notifications API error: ${res.status}`);
  return res.json();
}
```

Note there's no concept of "current logged-in customer ID" in the app yet
(no auth/session layer) — that needs to exist before this can be wired up for
real, since `customerId` is how the API scopes the feed to one person.

## Regenerating the notification feed

From `AIA-CallIntent-Prediction/`:

```
python src/train_and_export.py
```

This retrains the gate + intent LightGBM models, calibrates them, scores the
most recent 14 days of the synthetic book as "today", and writes
`data/processed/live_notifications.json` plus the persisted model artifacts
(`data/processed/models/*.joblib`). Copy the JSON into this repo:

```
cp ../AIA-CallIntent-Prediction/data/processed/live_notifications.json data/notifications.seed.json
cp data/notifications.seed.json data/notifications.json
```

## Path to production

Straight from `AIA-CallIntent-Prediction/FUTURE_PLAN.md`, translated into what
changes on this side:

1. **Real data, not synthetic.** The feed's usefulness is entirely bounded by
   the input data being real call/policy/payment/autopay records.
2. **Nightly batch job replaces the manual `train_and_export.py` run** —
   score the live book daily and write the feed to a real datastore (Postgres,
   not a JSON file) that this service reads from instead.
3. **Event-driven re-scoring** (Phase 2 in `FUTURE_PLAN.md`) for
   high-value triggers (autopay failure, due-date threshold crossed) so a
   notification can go out same-day instead of waiting for the next nightly
   batch.
4. **Auth**: `customerId` needs to come from a verified session, not a query
   param a client can pass arbitrarily.
5. **Cooldown/dedup already lives in the model export step** (7-day
   per-policy-per-intent cooldown baked into `live_notifications.json`) — once
   scoring is event-driven, that logic needs to move server-side into this
   service so it can dedupe across event-triggered and batch-triggered scores.
