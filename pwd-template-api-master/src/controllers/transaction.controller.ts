import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createTransaction = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { eventId, items, promotionCode, pointsUsed } = req.body;

    await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const transactionItemsToCreate = [];

      for (const item of items) {
        const ticketType = await tx.ticketType.findUnique({
          where: { id: item.ticketTypeId },
        });

        if (!ticketType || ticketType.quota < item.quantity) {
          throw new Error("Not enough tickets available.");
        }

        const unitPrice = ticketType.price.toNumber();
        totalPrice += unitPrice * item.quantity;

        transactionItemsToCreate.push({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          unitPrice: unitPrice,
        });
      }

      let finalPrice = totalPrice;
      let totalDiscount = 0;

      if (promotionCode) {
        const promotion = await tx.promotion.findUnique({
          where: { code: promotionCode },
        });
        if (!promotion) throw new Error("Invalid promotion code.");
        if (promotion.discountType === "PERCENTAGE") {
          totalDiscount +=
            finalPrice * (Number(promotion.discountAmount) / 100);
        } else if (promotion.discountType === "FIXED") {
          totalDiscount += Number(promotion.discountAmount);
        }
      }

      if (pointsUsed > 0) {
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

export const getTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        userId: true,
        eventId: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    res.status(200).json({
      transactionId: transaction.id,
      status: transaction.status,
      totalAmount: transaction.totalAmount.toNumber(),
      userId: transaction.userId,
      eventId: transaction.eventId,
    });
  } catch (error: any) {
    console.error("Error fetching transaction status:", error);
    res.status(500).json({
      message: "Failed to fetch transaction status.",
      error: error.message,
    });
  }
};
