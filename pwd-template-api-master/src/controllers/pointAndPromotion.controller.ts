import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

// API untuk mendapatkan total poin pengguna
export const getUserPoints = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // Mendapatkan userId dari token jwt

    // Ambil semua entri point milik user
    const userPoints = await prisma.point.findMany({
      where: {
        userId,
      },
      select: {
        amount: true,
      },
    });

    //Hitung total point
    const totalPoints = userPoints.reduce(
      (sum, point) => sum + point.amount,
      0
    );
    res.status(200).json({ totalPoints });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user points.", error });
  }
};

// API to create a new promotion
export const createPromotion = async (req: Request, res: Response) => {
  try {
    const {
      eventId,
      userId,
      name,
      code,
      discountAmount,
      discountType,
      isReferralPromo,
      maxRedemptions,
      startDate,
      endDate,
    } = req.body;

    const newPromotion = await prisma.promotion.create({
      data: {
        eventId,
        userId,
        name,
        code,
        discountAmount,
        discountType,
        isReferralPromo,
        maxRedemptions,
        startDate,
        endDate,
      },
    });
    res.status(201).json(newPromotion);
  } catch (error) {
    res.status(500).json({ message: "Failed to create promotion", error });
  }
};
