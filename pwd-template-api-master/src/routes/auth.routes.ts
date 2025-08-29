import { Router } from "express";
import {
  register,
  login,
  getUserProfile,
} from "../controllers/auth.controller";
import asyncHandler from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));

//Route ini dilindungi oleh middleware authMiddleware
authRouter.get("/profile", authMiddleware, asyncHandler(getUserProfile));
export default authRouter;
