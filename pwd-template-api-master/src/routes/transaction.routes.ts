import { Router } from "express";
import { createTransaction } from "../controllers/transaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/asyncHandler";
import { createSnapPaymentToken } from "../controllers/payment.controller";

const transactionRouter = Router();

transactionRouter.post("/", authMiddleware, asyncHandler(createTransaction));

transactionRouter.post(
  "/create-snap-token",
  authMiddleware,
  asyncHandler(createSnapPaymentToken)
);

export default transactionRouter;
