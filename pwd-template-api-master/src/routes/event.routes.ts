import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
} from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { organizerMiddleware } from "../middlewares/organizerMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const eventRouter = Router();

//Route yang diprotect untuk membuat event baru
eventRouter.post(
  "/",
  authMiddleware,
  organizerMiddleware,
  asyncHandler(createEvent)
);

//Route public untuk melihat semua event
eventRouter.get("/", asyncHandler(getEvents));
eventRouter.get("/:id", asyncHandler(getEventById));

export default eventRouter;
