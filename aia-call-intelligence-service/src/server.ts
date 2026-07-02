import cors from "cors";
import express from "express";
import { notificationsRouter } from "./routes/notifications.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4001);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/notifications", notificationsRouter);

app.listen(PORT, () => {
  console.log(`aia-call-intelligence-service listening on http://localhost:${PORT}`);
});
