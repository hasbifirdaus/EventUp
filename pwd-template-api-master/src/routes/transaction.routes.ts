import { Router } from "express";
import { createTransaction } from "../controllers/transaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/asyncHandler";
import { createSnapPaymentToken } from "../controllers/payment.controller";
import { getTransactionStatus } from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.post(
  "/create",
  authMiddleware,
  asyncHandler(createTransaction)
);

transactionRouter.post(
  "/create-snap-token",
  authMiddleware,
  asyncHandler(createSnapPaymentToken)
);

// **Endpoint baru untuk status**
transactionRouter.get(
  "/:id/status",
  authMiddleware,
  asyncHandler(getTransactionStatus)
);
export default transactionRouter;
