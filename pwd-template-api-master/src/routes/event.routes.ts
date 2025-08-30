import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import {
  createTicketType,
  getTicketTypesByEvent,
} from "../controllers/ticketTypes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { organizerMiddleware } from "../middlewares/organizerMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const eventRouter = Router();
////  ROUTE EVENT  ////
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

//Update & Deleate Event
eventRouter.put(
  "/:id",
  authMiddleware,
  organizerMiddleware,
  asyncHandler(updateEvent)
);
eventRouter.delete(
  "/:id",
  authMiddleware,
  organizerMiddleware,
  asyncHandler(deleteEvent)
);

////  ROUTE TICKETTYPE  ////
eventRouter.post(
  "/:eventId/ticket-types",
  authMiddleware,
  organizerMiddleware,
  asyncHandler(createTicketType)
);
eventRouter.get("/:eventId/ticket-types", asyncHandler(getTicketTypesByEvent));
export default eventRouter;
