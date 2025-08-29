import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, referralCode } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua kolom wajib diisi." });
    }

    const newUser = await registerUser({
      username,
      email,
      password,
      referralCode,
    });

    //Jangan kirim password kembali!
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "Pendaftaran berhasil! Silakan login.",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi." });
    }

    const { token, user } = await loginUser({ email, password });

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId; //Ambil userId dari token yang sudah diverifikas
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        referralCode: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
