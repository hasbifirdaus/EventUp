import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { config } from "./config/index";
import authRouter from "./routes/auth.routes";
import dashboardRouter from "./routes/dashboard.routes";
import referralRouter from "./routes/referral/referral.routes";
import eventRouter from "./routes/event.routes";
import pointAndPromotionRouter from "./routes/pointAndPromotion.routes";

const app: Express = express();
const port: number = parseInt(config.port as string, 10) || 8000; // Mengubah tipe port menjadi number

app.use(cors()); // Semua client dapat mengakses API kita
app.use(express.json()); //Untuk membaca body request dalam format JSON

app.use("/api", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/referral", referralRouter);
app.use("/api/events", eventRouter);
app.use("/api", pointAndPromotionRouter);

//running app
app.listen(port, () => {
  console.log(`[🔥API] Running in http://localhost:${port}/`);
});
