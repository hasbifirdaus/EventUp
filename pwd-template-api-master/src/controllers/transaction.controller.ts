import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createTransaction = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { eventId, items, promotionCode, pointsUsed } = req.body;

    await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const transactionItemsToCreate = [];

      // Loop untuk validasi dan perhitungan total harga
      for (const item of items) {
        const ticketType = await tx.ticketType.findUnique({
          where: { id: item.ticketTypeId },
        });

        if (!ticketType || ticketType.quota < item.quantity) {
          throw new Error("Not enough tickets available.");
        }

        // Simpan harga dari database ke dalam variabel
        const unitPrice = ticketType.price.toNumber();
        totalPrice += unitPrice * item.quantity;

        // Simpan data item untuk pembuatan transaksi di akhir
        transactionItemsToCreate.push({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          unitPrice: unitPrice, // Gunakan harga dari database di sini
        });
      }

      let finalPrice = totalPrice;
      let totalDiscount = 0;

      if (promotionCode) {
        const promotion = await tx.promotion.findUnique({
          where: { code: promotionCode },
        });
        if (
          !promotion ||
          promotion.endDate < new Date() ||
          (promotion.maxRedemptions !== null && promotion.maxRedemptions <= 0)
        ) {
          throw new Error("Invalid or expired promotion code.");
        }
        if (promotion.discountType === "PERCENTAGE") {
          totalDiscount +=
            finalPrice * (Number(promotion.discountAmount) / 100);
        } else if (promotion.discountType === "FIXED") {
          totalDiscount += Number(promotion.discountAmount);
        }
        await tx.promotion.update({
          where: { id: promotion.id },
          data: { maxRedemptions: { decrement: 1 } },
        });
      }

      if (pointsUsed > 0) {
        const userPoints = await tx.point.aggregate({
          where: { userId, expirationDate: { gt: new Date() } },
          _sum: { amount: true },
        });
        const totalUserPoints = Number(userPoints._sum.amount) || 0;
        if (totalUserPoints < pointsUsed) {
          throw new Error("Not enough points.");
        }
        totalDiscount += pointsUsed;
      }

      finalPrice -= totalDiscount;
      if (finalPrice < 0) finalPrice = 0;

      const newTransaction = await tx.transaction.create({
        data: {
          userId,
          eventId,
          totalAmount: finalPrice,
          status: "PENDING",
          pointUsed: pointsUsed > 0 ? pointsUsed : null,
          promotionId: promotionCode
            ? (
                await tx.promotion.findUnique({
                  where: { code: promotionCode },
                })
              )?.id
            : null,
          items: {
            // Gunakan array yang sudah berisi unitPrice
            create: transactionItemsToCreate,
          },
        },
      });

      res.status(201).json({
        transactionId: newTransaction.id,
      });
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Transaction failed.", error: error.message });
  }
};
