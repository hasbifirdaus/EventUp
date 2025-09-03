import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import dashboardRouter from "./routes/dashboard.routes";
import referralRouter from "./routes/referral/referral.routes";
import eventRouter from "./routes/event.routes";
import pointAndPromotionRouter from "./routes/pointAndPromotion.routes";
import transactionRouter from "./routes/transaction.routes";
import { handleMidtransNotification } from "./controllers/midtrans.webhook.controller";
import historyRouter from "./routes/history.routes";

const app: Express = express();
const port: number = 8000;

app.use(
  cors({
    origin: "http://localhost:3000", // asal frontend
    credentials: true, // izinkan cookie / header auth
  })
);
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", pointAndPromotionRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/referral", referralRouter);
app.use("/api/events", eventRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/history", historyRouter);

app.post("/api/midtrans-webhook", handleMidtransNotification);
app.post("/api/midtrans-webhook/", handleMidtransNotification);

//running app
app.listen(port, () => {
  console.log(`[🔥API] Running in http://localhost:${port}/`);
});
