import { Router } from "express";
import * as store from "../store/notificationStore.js";

export const notificationsRouter = Router();

// GET /api/notifications?customerId=C102221
// GET /api/notifications?policyNo=T13392
notificationsRouter.get("/", (req, res) => {
  const { customerId, policyNo, includeDismissed } = req.query;
  const withDismissed = includeDismissed === "true";

  if (typeof customerId === "string") {
    return res.json(store.listForCustomer(customerId, withDismissed));
  }
  if (typeof policyNo === "string") {
    return res.json(store.listForPolicy(policyNo, withDismissed));
  }
  return res.json(store.listAll());
});

notificationsRouter.post("/:id/read", (req, res) => {
  const updated = store.markRead(req.params.id);
  if (!updated) return res.status(404).json({ error: "notification not found" });
  return res.json(updated);
});

notificationsRouter.post("/:id/dismiss", (req, res) => {
  const updated = store.dismiss(req.params.id);
  if (!updated) return res.status(404).json({ error: "notification not found" });
  return res.json(updated);
});
