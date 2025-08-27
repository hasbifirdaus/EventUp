import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validation/auth.validation";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    await registerSchema.validate(req.body, { abortEarly: false });
    const { user, token } = await registerUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully", user, token });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.errors });
      return; // cukup return void, jangan return res
    }
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    await loginSchema.validate(req.body, { abortEarly: false });
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.errors });
      return; // cukup return void
    }
    res.status(401).json({ error: error.message });
  }
};
