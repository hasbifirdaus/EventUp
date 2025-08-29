import { Request, Response, NextFunction } from "express";

export const organizerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "ORGANIZER") {
    res.status(403).json({
      message: "Akses ditolak. Anda bukan seorang penyelenggara (ORGANIZER)",
    });
    return;
  }
  next();
};
