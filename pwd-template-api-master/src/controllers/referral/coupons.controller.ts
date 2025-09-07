import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { disconnect } from "process";

//Mengambil semua promosi (kupon)  untuk pengguna yang sedang login
export const getMyPromotions = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const promotions = await prisma.promotion.findMany({
      where: { userId },
      orderBy: { endDate: "desc" },
    });

    //Data untuk frontend
    const formattedPromotions = promotions.map((promo) => {
      const isExpired = new Date(promo.endDate) < new Date();

      return {
        code: promo.code,
        discount:
          promo.discountType === "PERCENTAGE"
            ? `${Number(promo.discountAmount)}%`
            : `IDR ${promo.discountAmount.toLocaleString()}`,
        validUntil: promo.endDate.toISOString().split("T")[0],
        status: isExpired ? "expired" : "active",
      };
    });
    res.status(200).json({
      message: "Promotion loaded successfully.",
      coupons: formattedPromotions,
    });
  } catch (error) {
    console.error("Error getting user promotions:", error);
    res.status(500).json({ message: "Failed to retrieve user promotions." });
  }
};
