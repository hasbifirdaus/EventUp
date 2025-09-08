// src/routes/event.routes.ts
import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
} from "../controllers/event.controller";
import {
  createTicketType,
  getTicketTypesByEvent,
} from "../controllers/ticketTypes.controller";
import { authMiddleware, authorizeRole } from "../middlewares/auth.middleware"; // Import authorizeRole
import asyncHandler from "../middlewares/asyncHandler";

const eventRouter = Router();

// Route untuk organizer
eventRouter.post(
  "/",
  authMiddleware,
  authorizeRole(["ORGANIZER"]),
  asyncHandler(createEvent)
);
eventRouter.put(
  "/:id",
  authMiddleware,
  authorizeRole(["ORGANIZER"]),
  asyncHandler(updateEvent)
);
eventRouter.delete(
  "/:id",
  authMiddleware,
  authorizeRole(["ORGANIZER"]),
  asyncHandler(deleteEvent)
);
eventRouter.get(
  "/organizer",
  authMiddleware,
  authorizeRole(["ORGANIZER"]),
  asyncHandler(getOrganizerEvents)
);

eventRouter.post(
  "/:eventId/ticket-types",
  authMiddleware,
  asyncHandler(createTicketType)
);

// Route public
eventRouter.get("/", asyncHandler(getEvents));
eventRouter.get("/:id", asyncHandler(getEventById));
eventRouter.get("/:eventId/ticket-types", asyncHandler(getTicketTypesByEvent));

export default eventRouter;
