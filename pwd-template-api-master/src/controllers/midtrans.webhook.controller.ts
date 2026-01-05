import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import { TicketStatusEnum } from "../../src/generated/prisma";
import crypto from "crypto";

export const handleMidtransNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string;

    // 1. Signature Key Validation

    const receivedSignature = req.body.signature_key;
    const payloadForSignature = [
      req.body.order_id,
      req.body.status_code,
      req.body.gross_amount,
      serverKey,
    ].join("");

    const expectedSignature = crypto
      .createHash("sha512")
      .update(payloadForSignature)
      .digest("hex");

    // kondisi untuk bypass validasi di lingkungan development
    if (process.env.NODE_ENV !== "development") {
      if (receivedSignature !== expectedSignature) {
        console.error("Invalid signature:", receivedSignature);
        res.status(403).send("Invalid signature");
        return;
      }

      //untuk bypass
    } else {
      console.log("SKIPPING signature validation in DEVELOPMENT environment.");
    }

    // 2. Respon cepat ke Midtrans

    res.status(200).send("OK"); // Kirim OK segera supaya Midtrans tidak retry

    // 3. Proses transaction async

    const transactionStatus = req.body.transaction_status;
    const orderId = req.body.order_id;
    const fraudStatus = req.body.fraud_status;

    const transactionId = parseInt(orderId.split("-").pop() || "");
    if (isNaN(transactionId)) {
      console.error("Invalid transactionId:", orderId);
      return;
    }

    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: {
          items: true,
          promotionUsed: true,
          user: { include: { points: true } },
        },
      });

      if (!transaction) {
        console.error("Transaction not found:", transactionId);
        return;
      }

      if (transaction.status === "PAID") {
        console.log("Transaction already PAID:", transactionId);
        return;
      }

      // 4. Status PAID

      if (
        (transactionStatus === "capture" && fraudStatus === "accept") ||
        transactionStatus === "settlement"
      ) {
        console.log(`Processing PAID for transaction ${transactionId}...`);

        // Update promo
        if (
          transaction.promotionUsed?.maxRedemptions &&
          transaction.promotionUsed.maxRedemptions > 0
        ) {
          await tx.promotion.update({
            where: { id: transaction.promotionUsed.id },
            data: { maxRedemptions: { decrement: 1 } },
          });
        }

        //Deduct points
        if (transaction.pointUsed && transaction.pointUsed > 0) {
          let remainingPoints = transaction.pointUsed;
          const userPoints = await tx.point.findMany({
            where: {
              userId: transaction.userId,
              expirationDate: { gt: new Date() },
              amount: { gt: 0 },
            },
            orderBy: { expirationDate: "asc" },
          });

          for (const p of userPoints) {
            if (remainingPoints <= 0) break;
            const deduct = Math.min(p.amount, remainingPoints);
            await tx.point.update({
              where: { id: p.id },
              data: { amount: p.amount - deduct },
            });
            remainingPoints -= deduct;
          }
        }

        // Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "PAID" },
        });

        //Kurangi kuota tiket & buat tiket
        const ticketsToCreate: any[] = [];
        for (const item of transaction.items) {
          const ticketType = await tx.ticketType.findUnique({
            where: { id: item.ticketTypeId },
          });
          if (!ticketType) continue;

          const quantityToDeduct = Math.min(item.quantity, ticketType.quota);
          if (quantityToDeduct > 0) {
            await tx.ticketType.update({
              where: { id: item.ticketTypeId },
              data: { quota: { decrement: quantityToDeduct } },
            });

            for (let i = 0; i < quantityToDeduct; i++) {
              ticketsToCreate.push({
                eventId: transaction.eventId,
                ticketTypeId: item.ticketTypeId,
                ownerId: transaction.userId,
                transactionItemId: item.id,
                ticketCode: `TKT-${uuidv4()}`,
                status: TicketStatusEnum.SOLD,
              });
            }
          }
        }

        if (ticketsToCreate.length > 0) {
          await tx.ticket.createMany({ data: ticketsToCreate });
          console.log(`${ticketsToCreate.length} tickets created.`);
        }
      }

      // 5. Status CANCELLED / DENY / EXPIRE
      else if (["deny", "cancel", "expire"].includes(transactionStatus)) {
        console.log(`Processing CANCELLED for transaction ${transactionId}...`);
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "CANCELLED" },
        });
      }
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
  }
};
