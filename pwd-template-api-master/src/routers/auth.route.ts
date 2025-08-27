import { Router, Request, Response, NextFunction } from "express";
import { register, login } from "../controllers/auth.controller";

const authRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);

// Gunakan asyncHandler di setiap route
authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));

export default authRouter;
