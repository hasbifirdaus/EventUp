import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma";
import { v4 as uuidv4 } from "uuid"; // Untuk membuat kode referral unik
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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
        // Role secara default sudah 'CUSTOMER' di skema Prisma Anda
      },
    });

    // 4. Periksa apakah ada kode referral yang digunakan saat pendaftaran
    if (data.referralCode) {
      // Cari pemilik kode referral yang digunakan
      const referrer = await prisma.user.findUnique({
        where: { referralCode: data.referralCode },
      });

      if (referrer) {
        // Logika untuk memberikan poin ke pemilik kode referral
        await prisma.point.create({
          data: {
            userId: referrer.id,
            amount: 10000,
            expirationDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // 3 bulan
          },
        });

        // Logika untuk memberikan kupon diskon ke pengguna baru
        await prisma.promotion.create({
          data: {
            userId: newUser.id,
            code: `${newReferralCode.slice(0, 5)}-DISCOUNT`,
            discountAmount: 10,
            discountType: "PERCENTAGE",
            isReferralPromo: true,
            startDate: new Date(),
            endDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // 3 bulan
          },
        });

        // Simpan relasi referral di tabel Referral
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

  return { token, user };
};
