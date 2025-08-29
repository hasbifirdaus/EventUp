import { Router } from "express";
import { getOrganizerDashboard } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { organizerMiddleware } from "../middlewares/organizerMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const dashboardRouter = Router();

dashboardRouter.get(
  "/organizer",
  authMiddleware,
  organizerMiddleware,
  asyncHandler(getOrganizerDashboard)
);

export default dashboardRouter;
