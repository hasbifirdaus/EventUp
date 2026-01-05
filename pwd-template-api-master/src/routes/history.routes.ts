import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getMyTransactions,
  getMyTickets,
} from "../controllers/history.controller";
import asyncHandler from "../middlewares/asyncHandler";

const historyRouter = Router();

historyRouter.get(
  "/my-transactions",
  authMiddleware,
  asyncHandler(getMyTransactions)
);
historyRouter.get("/my-tickets", authMiddleware, asyncHandler(getMyTickets));

export default historyRouter;
