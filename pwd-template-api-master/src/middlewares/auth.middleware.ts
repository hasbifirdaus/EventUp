import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import prisma from "../prisma/client";
import { config } from "../config/index";

interface JwtPayload {
  userId: string;
  role: string;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ambil token dari Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token JWT
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Ambil user dari database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        referralCode: true,
        // hanya select field yang dibutuhkan, tidak termasuk password
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user ke request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: "Server error during authentication" });
  }
};

export default authMiddleware;
