import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, referralCode } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua kolom wajib diisi." });
    }

    // Panggil fungsi registerUser yang sudah menangani transaksi
    const { newUser, referrerWithPoints } = await registerUser({
      username,
      email,
      password,
      referralCode,
    });

    // Hapus password dari objek pengguna sebelum dikirim ke klien
    const { password: _, ...userWithoutPassword } = newUser;

    // Kirim respons yang menyertakan data pengguna baru dan informasi referrer
    res.status(201).json({
      message: "Pendaftaran berhasil!",
      user: userWithoutPassword,
      referrerWithPoints,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email / Username dan password wajib diisi." });
    }

    const { token, refreshToken, user } = await loginUser({
      identifier,
      password,
    });

    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
    });
    const roles = userRoles.map((r: { role: string }) => r.role);

    res.status(200).json({
      message: "Login berhasil",
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        roles,
      },
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId; //Ambil userId dari token yang sudah diverifikasi
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        referralCode: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    // Ambil peran pengguna dari tabel UserRole
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      select: { role: true },
    });
    const roles = userRoles.map((ur: { role: string }) => ur.role);

    res.status(200).json({ ...user, roles });
  } catch (error: any) {
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token diperlukan." });
    }

    // cek apakah ada di DB
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
    });
    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token tidak valid." });
    }

    // verifikasi refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY as string
    ) as { userId: string };

    // generate access token baru
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Refresh token tidak valid / kadaluarsa." });
  }
};
