import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import { TicketStatusEnum } from "../generated/prisma";
const midtransClient = require("midtrans-client");

export const handleMidtransNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string;

    const core = new midtransClient.CoreApi({
      isProduction,
      serverKey,
    });

    const statusResponse = await core.transaction.notification(req.body);
    const { transaction_status, order_id, fraud_status } = statusResponse;
    const transactionId = order_id.split("-").pop();

    await prisma.$transaction(async (tx) => {
      // Menggunakan `include` untuk memuat relasi 'items'
      const transaction = await tx.transaction.findUnique({
        where: { id: parseInt(transactionId as string) },
        include: { items: true },
      });

      if (!transaction) {
        console.error("Transaction not found for ID:", transactionId);
        return res.status(404).send("Transaction not found.");
      }

      if (transaction.status === "PAID") {
        console.log("Transaction already PAID, returning OK.");
        return res.status(200).send("OK");
      }

      // Gabungkan logika `settlement` dan `capture`
      if (
        (transaction_status === "capture" && fraud_status === "accept") ||
        transaction_status === "settlement"
      ) {
        console.log(`Processing '${transaction_status}' status...`);

        // Perbarui status transaksi
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "PAID" },
        });

        // Gunakan data 'items' yang sudah dimuat dari `include`
        const transactionItems = transaction.items;

        if (transactionItems.length === 0) {
          console.error("No transaction items found.");
          return; // Menghentikan proses jika tidak ada item
        }

        const allTicketsToCreate: any[] = [];
        for (const item of transactionItems) {
          // Kurangi kuota tiket
          await tx.ticketType.update({
            where: { id: item.ticketTypeId },
            data: { quota: { decrement: item.quantity } },
          });

          // Buat tiket
          for (let i = 0; i < item.quantity; i++) {
            allTicketsToCreate.push({
              eventId: transaction.eventId,
              ticketTypeId: item.ticketTypeId,
              ownerId: transaction.userId,
              transactionItemId: item.id,
              ticketCode: `TKT-${uuidv4()}`,
              status: TicketStatusEnum.SOLD,
            });
          }
        }
        await tx.ticket.createMany({ data: allTicketsToCreate });
        console.log(
          `${allTicketsToCreate.length} tickets created successfully.`
        );
      } else if (
        ["deny", "cancel", "expire"].includes(transaction_status as string)
      ) {
        console.log(`Processing '${transaction_status}' status...`);
        // Perbarui status menjadi CANCELLED
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "CANCELLED" },
        });
      }
    });

    res.status(200).send("OK");
  } catch (error: any) {
    console.error("Webhook error:", error);
    res
      .status(500)
      .json({ message: "Failed to handle webhook.", error: error.message });
  }
};
