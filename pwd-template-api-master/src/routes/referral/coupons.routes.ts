import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMyPromotions } from "../../controllers/referral/coupons.controller";
import asyncHandler from "../../middlewares/asyncHandler";

const couponsRouter = Router();

//Rute untuk mengambil semua kupon promosi yang dimiliki pengguna
couponsRouter.get("/my-coupons", authMiddleware, asyncHandler(getMyPromotions));

export default couponsRouter;
