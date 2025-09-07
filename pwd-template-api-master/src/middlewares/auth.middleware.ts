/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //1.Ambil token dari header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Akses ditolak. Token tidak valid." });
    return;
  }

  const token = authHeader.split(" ")[1]; //Format : "Bearer TOKEN"
  if (!token) {
    res.status(401).json({ message: "Akses ditolak. Token tidak valid." });
    return;
  }

  //2.Verifikasi token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
      roles: string[];
    };
    req.user = decoded; //menyimpan data pengguna ke objek request
    next(); //Lanjutkan ke handler rute berikutnya
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid." });
    return;
  }
};

//Middleware untuk otorisasi berbasis peran (hanya untuk peran tertentu)
export const authorizeRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoles = (req as any).user?.roles;

      if (!userRoles || !Array.isArray(userRoles)) {
        res
          .status(403)
          .json({ message: "Akses ditolak. Informasi peran hilang." });
        return;
      }

      const hasPermission = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasPermission) {
        res
          .status(403)
          .json({ message: "Forbidden: Anda tidak memiliki akses" });
        return;
      }
      next();
    } catch (error) {
      console.error("Error di middleware authorizeRole:", error);
      res.status(500).json({ message: "Kesalahan server saat otorisasi." });
      return;
    }
  };
};
