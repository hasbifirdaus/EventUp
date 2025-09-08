import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

// Fungsi untuk mendaftarkan pengguna baru
export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
  referralCode?: string;
}) => {
  try {
    // Jalankan semua operasi dalam satu transaksi
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Hash password untuk keamanan
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 2. Buat kode referral unik untuk pengguna baru
      const newReferralCode = uuidv4().slice(0, 8).toUpperCase();

      // 3. Simpan pengguna baru ke database
      const newUser = await tx.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          referralCode: newReferralCode,
          // Role secara default sudah 'CUSTOMER' di skema Prisma
        },
      });

      // Berikan kedua peran (CUSTOMER dan ORGANIZER) kepada pengguna baru
      await tx.userRole.createMany({
        data: [
          { userId: newUser.id, role: "CUSTOMER" },
          { userId: newUser.id, role: "ORGANIZER" },
        ],
      });

      let referrerWithPoints = null;

      // 4. Periksa apakah ada kode referral yang digunakan saat pendaftaran
      if (data.referralCode) {
        // Cari pemilik kode referral yang digunakan
        const referrer = await tx.user.findUnique({
          where: { referralCode: data.referralCode },
        });

        if (referrer) {
          // Tentukan tanggal kadaluwarsa 3 bulan dari sekarang
          const expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + 3);

          // 5. Berikan 10.000 point kepada pemilik kode referral
          await tx.point.create({
            data: {
              userId: referrer.id,
              amount: 10000,
              expirationDate,
            },
          });

          // 6. Memberikan kupon diskon 10% ke pengguna baru
          const referralPromotionCode = `referral-${uuidv4().substring(0, 8).toUpperCase()}`;
          await tx.promotion.create({
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

          // 7. Simpan relasi referral di tabel Referral
          await tx.referral.create({
            data: {
              referrerId: referrer.id,
              referredUserId: newUser.id,
            },
          });

          // 8. Ambil data referrer yang diperbarui, termasuk poin total mereka
          // Ini adalah perubahan utama agar API bisa mengembalikan data poin
          const allReferrerPoints = await tx.point.findMany({
            where: { userId: referrer.id },
            select: { amount: true },
          });
          const totalPoints = allReferrerPoints.reduce(
            (sum: number, point: { amount: number }) => sum + point.amount,
            0
          );

          referrerWithPoints = {
            id: referrer.id,
            username: referrer.username,
            email: referrer.email,
            referralCode: referrer.referralCode,
            totalPoints: totalPoints,
          };
        }
      }

      // 9. Kembalikan data pengguna baru DAN pemilik kode referral (jika ada)
      return { newUser, referrerWithPoints };
    });

    return transactionResult;
  } catch (error) {
    throw new Error("Pendaftaran gagal. Pastikan data unik.");
  }
};

// Fungsi untuk login pengguna
export const loginUser = async (data: {
  identifier: string;
  password: string;
}) => {
  // 1. Cari pengguna berdasarkan email atau username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.identifier }, { username: data.identifier }],
    },
  });

  if (!user) {
    throw new Error("Email / Username salah.");
  }

  // 2. Bandingkan password yang dimasukkan dengan yang di database
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Password salah.");
  }

  const userRoles = await prisma.userRole.findMany({
    where: { userId: user.id },
  });

  const roles = userRoles.map((r: { role: string }) => r.role);

  // 3. Buat JWT (JSON Web Token)
  const token = jwt.sign(
    { userId: user.id, roles },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "3d" } // Token akan kedaluwarsa dalam 1 jam
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

  return { token, refreshToken, user: { ...user, roles } };
};
