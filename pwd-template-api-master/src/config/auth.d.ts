import { Request } from "express";
import { User } from "../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>; // Add the 'user' property to the Request object
    }
  }
}
