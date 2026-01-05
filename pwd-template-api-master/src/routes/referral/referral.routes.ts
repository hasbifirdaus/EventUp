import { Router } from "express";
import { getMyPoints } from "../../controllers/referral/referral.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import asyncHandler from "../../middlewares/asyncHandler";

const referralRouter = Router();

//Route untuk melihat point referral
referralRouter.get("/my-points", authMiddleware, asyncHandler(getMyPoints));

export default referralRouter;
