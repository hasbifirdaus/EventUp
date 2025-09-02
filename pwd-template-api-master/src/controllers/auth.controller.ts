import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";
import { error } from "console";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, referralCode } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua kolom wajib diisi." });
    }

    const newUser = await prisma.$transaction(async (tx) => {
      // Step 1: Daftarkan pengguna baru
      const user = await registerUser({
        username,
        email,
        password,
        referralCode,
      });

      // Step 2: Proses logika referralCode jika ada
      if (referralCode) {
        // Cari pengguna yang memiliki kode referral tersebut (pemberi referral)
        const referrer = await tx.user.findUnique({
          where: { referralCode },
        });

        if (referrer) {
          // Hitung tanggal kadaluarsa 3 bulan dari sekarang
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 3);

          // Berikan 10.000 poin kepada pemilik kode referral
          await tx.point.create({
            data: {
              userId: referrer.id,
              amount: 10000,
              expirationDate: expiryDate,
            },
          });

          // Buat promosi diskon 10% untuk pengguna baru
          await tx.promotion.create({
            data: {
              userId: user.id,
              name: "Referral Discount",
              code: `REFERRAL-${user.id}`, // Kode unik untuk pengguna baru
              discountAmount: 10,
              discountType: "PERCENTAGE",
              isReferralPromo: true,
              maxRedemptions: 1, // Hanya bisa digunakan sekali
              startDate: new Date(),
              endDate: expiryDate,
            },
          });
        }
      }

      return user;
    });

    // Jangan kirim password kembali!
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

    const { token, refreshToken, user } = await loginUser({ email, password });

    res.status(200).json({
      message: "Login berhasil",
      token,
      refreshToken,
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
    const userId = req.user.userId; //Ambil userId dari token yang sudah diverifikasi
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
