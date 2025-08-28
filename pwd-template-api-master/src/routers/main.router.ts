import { Router } from "express";
import authRouter from "./auth.route"; // Impor authRouter yang sudah dibuat

const mainRouter = Router();

// Endpoint untuk auth
mainRouter.use("/api/auth", authRouter);

// Endpoint untuk test
mainRouter.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

export default mainRouter;
