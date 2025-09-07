import { Request, Response, NextFunction } from "express";

export const organizerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Cek jika user object ada
    if (!req.user) {
      console.error("Error: Token tidak valid atau hilang.");
      res.status(401).json({ message: "Akses tidak diizinkan." });
      return;
    } // Cek jika role array ada dan pastikan isinya role "ORGANIZER"

    if (!req.user.roles || !req.user.roles.includes("ORGANIZER")) {
      console.error("Akses Ditolak: Peran (role) 'ORGANIZER' tidak ditemukan.");
      res.status(403).json({
        message: "Akses ditolak. Anda bukan seorang penyelenggara.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error di organizerMiddleware:", error);
    res.status(500).json({ message: "Internal server error di middleware." });
  }
};
