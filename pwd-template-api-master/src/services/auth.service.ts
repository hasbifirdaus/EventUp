import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { v4 as uuidv4 } from "uuid"; // Untuk membuat kode referral unik
import jwt from "jsonwebtoken";
import { http } from "winston";

// Fungsi untuk mendaftarkan pengguna baru
export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
  referralCode?: string;
}) => {
  try {
    // 1. Hash password untuk keamanan
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 2. Buat kode referral unik untuk pengguna baru
    const newReferralCode = uuidv4().slice(0, 8).toUpperCase();

    // 3. Simpan pengguna baru ke database
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        referralCode: newReferralCode,
        // Role secara default sudah 'CUSTOMER' di skema Prisma
      },
    });

    // 4. Periksa apakah ada kode referral yang digunakan saat pendaftaran
    if (data.referralCode) {
      // Cari pemilik kode referral yang digunakan
      const referrer = await prisma.user.findUnique({
        where: { referralCode: data.referralCode },
      });

      if (referrer) {
        //tentukan tanggal kadaluwarsa 3 bulan dari sekarang
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 3);

        //5.Berikan 10.000 point kepada pemilik kode referral
        await prisma.point.create({
          data: {
            userId: referrer.id,
            amount: 10000,
            expirationDate,
          },
        });

        // 6. memberikan kupon diskon 10% ke pengguna baru
        const referralPromotionCode = ` referral-${uuidv4().substring(0, 8).toUpperCase()}`;
        await prisma.promotion.create({
          data: {
            userId: newUser.id,
            name: "Diskon Pendaftaran Referral",
            code: referralPromotionCode,
            discountAmount: 10,
            discountType: "PERCENTAGE",
            isReferralPromo: true,
            startDate: new Date(),
            endDate: expirationDate,
          },
        });

        // 7.Simpan relasi referral di tabel Referral
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: newUser.id,
          },
        });
      }
    }

    return newUser;
  } catch (error) {
    throw new Error("Pendaftaran gagal. Pastikan data unik.");
  }
};

// Fungsi untuk login pengguna
export const loginUser = async (data: { email: string; password: string }) => {
  // 1. Cari pengguna berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Email atau password salah.");
  }

  // 2. Bandingkan password yang dimasukkan dengan yang di database
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email atau password salah.");
  }

  // 3. Buat JWT (JSON Web Token)
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "1h" } // Token akan kedaluwarsa dalam 1 jam
  );

  //Refresh Token
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET_KEY as string,
    { expiresIn: "7d" }
  );

  //simpan refresh token ke DB biar bisa revoke kalau perlu
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
    },
  });

  return { token, refreshToken, user };
};
