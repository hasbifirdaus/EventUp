import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key", // Ganti dengan secret key yang kuat
    expiresIn: "1d",
  },
  referral: {
    points: 10000, // Poin yang diberikan ke referrer
    discount: 10, // Diskon dalam persen untuk user baru
    validityInDays: 90, // Kupon diskon berlaku 90 hari
  },
};
