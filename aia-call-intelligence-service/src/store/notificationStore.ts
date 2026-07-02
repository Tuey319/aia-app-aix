import fs from "node:fs";
import path from "node:path";
import type { Notification } from "../types.js";

// Prototype persistence: a flat JSON file standing in for a real database.
// data/notifications.json is the live, mutable copy; data/notifications.seed.json
// is the checked-in snapshot produced by AIA-CallIntent-Prediction/src/train_and_export.py
// (copy it over with `npm run reset-data` to get a fresh feed).
const DATA_DIR = path.resolve(process.cwd(), "data");
const LIVE_PATH = path.join(DATA_DIR, "notifications.json");
const SEED_PATH = path.join(DATA_DIR, "notifications.seed.json");

function load(): Notification[] {
  const source = fs.existsSync(LIVE_PATH) ? LIVE_PATH : SEED_PATH;
  const raw = fs.readFileSync(source, "utf-8");
  return JSON.parse(raw) as Notification[];
}

let notifications: Notification[] = load();

function persist() {
  fs.writeFileSync(LIVE_PATH, JSON.stringify(notifications, null, 2), "utf-8");
}

export function listAll(): Notification[] {
  return notifications;
}

export function listForCustomer(customerId: string, includeDismissed = false): Notification[] {
  return notifications
    .filter((n) => n.customerId === customerId && (includeDismissed || !n.dismissed))
    .sort((a, b) => b.snapshotDate.localeCompare(a.snapshotDate));
}

export function listForPolicy(policyNo: string, includeDismissed = false): Notification[] {
  return notifications
    .filter((n) => n.policyNo === policyNo && (includeDismissed || !n.dismissed))
    .sort((a, b) => b.snapshotDate.localeCompare(a.snapshotDate));
}

export function markRead(id: string): Notification | undefined {
  const n = notifications.find((x) => x.id === id);
  if (!n) return undefined;
  n.read = true;
  persist();
  return n;
}

export function dismiss(id: string): Notification | undefined {
  const n = notifications.find((x) => x.id === id);
  if (!n) return undefined;
  n.dismissed = true;
  persist();
  return n;
}

export function reload(): void {
  notifications = load();
}
