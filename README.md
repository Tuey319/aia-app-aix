# AIA+ App

High-fidelity AIA+ insurance super-app built with React Native + Expo, plus a proactive call-intent prediction model for the call center.

## Structure

```
aia-app/                       ← Expo app (React Native, TypeScript)
aia-call-intelligence-service/ ← Backend: serves the proactive call-intent notification feed to the app
AIA-CallIntent-Prediction/     ← ML project: predicts proactive-outreach call topics from policy/payment/login data
design_handoff_aia_app/        ← Original design handoff spec (prototype HTML, screenshots, screen-by-screen reference)
```

## Quick start

```bash
cd aia-app
npm install
npx expo start        # scan QR with Expo Go
npx expo start --web  # browser preview
```

See [aia-app/README.md](aia-app/README.md) for the full guide — screen inventory, design tokens, known gaps, and how to connect real APIs.

See [aia-call-intelligence-service/README.md](aia-call-intelligence-service/README.md) for the notification backend — API endpoints, local dev, and deployment.

See [AIA-CallIntent-Prediction/README.md](AIA-CallIntent-Prediction/README.md) for the call-intent prediction model — data generation, feature pipeline, and the analysis notebook.

## Contributing

See [aia-app/CONTRIBUTING.md](aia-app/CONTRIBUTING.md) for code conventions, icon rules, and the PR checklist.
