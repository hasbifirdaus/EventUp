import { Router } from "express";
import {
  getUserPoints,
  createPromotion,
} from "../controllers/pointAndPromotion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { organizerMiddleware } from "../middlewares/organizerMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const pointAndPromotionRouter = Router();

//Route point : Hanya pengguna yang sudah login
pointAndPromotionRouter.get(
  "/points",
  authMiddleware,
  asyncHandler(getUserPoints)
);

//Route Promosi: Hanya untuk organizer
pointAndPromotionRouter.post(
  "/promotions",
  authMiddleware,
  organizerMiddleware,
  asyncHandler(createPromotion)
);

export default pointAndPromotionRouter;
