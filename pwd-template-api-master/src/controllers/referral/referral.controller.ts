import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getMyPoints = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    //Ambil semua poin yang dimiliki pengguna
    const points = await prisma.point.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc", //Urutkan dari yang terbaru
      },
    });
    //Hitung total poin yang valid (belum kadaluwarsa)
    const totalValidPoints = points.reduce((total, point) => {
      //periksa apakah poin masih berlaku
      if (point.expirationDate && point.expirationDate > new Date()) {
        return total + point.amount;
      }
      return total;
    }, 0);
    res.status(200).json({
      message: "Data poin berhasi dimuat.",
      totalValidPoints,
      points,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
