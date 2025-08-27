import { Router } from "express";
import { registerController } from "../controllers/authentication.controller";

const authenticationRoute = Router();

authenticationRoute.post("/register", registerController);

export default authenticationRoute;
