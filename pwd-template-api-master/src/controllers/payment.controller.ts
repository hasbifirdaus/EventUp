import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { snap } from "../config/midtrans.config";

export const createSnapPaymentToken = async (req: Request, res: Response) => {
  interface ItemDetail {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }

  interface ITransactionItem {
    ticketTypeId: number;
    ticketType: {
      name: string;
    };
    unitPrice: {
      toNumber: () => number;
    };
    quantity: number;
  }

  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required." });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
      include: {
        items: {
          include: {
            ticketType: {
              select: { name: true, price: true },
            },
          },
        },
        user: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    // Buat daftar item dari transaksi
    const itemDetails: ItemDetail[] = transaction.items.map(
      (item: ITransactionItem) => ({
        id: `TICKET-${item.ticketTypeId}`,
        name: item.ticketType.name,
        price: item.unitPrice.toNumber(),
        quantity: item.quantity,
      })
    );

    // Hitung total harga item tanpa diskon
    let grossAmountFromItems = itemDetails.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Hitung total diskon (selisih antara harga asli dan harga final)
    const totalDiscount =
      grossAmountFromItems - transaction.totalAmount.toNumber();

    // Jika ada diskon, tambahkan item diskon ke daftar
    if (totalDiscount > 0) {
      itemDetails.push({
        id: `DISCOUNT-${transaction.promotionId || "POINTS"}`,
        name: `Discount (${transaction.promotionId ? "Promo" : "Poin"})`,
        price: -totalDiscount, // Harga negatif untuk mengurangi total
        quantity: 1,
      });
    }

    const snapPayload = {
      transaction_details: {
        order_id: `TRX-${transaction.id}`,
        gross_amount: transaction.totalAmount.toNumber(),
      },
      item_details: itemDetails,
      customer_details: {
        first_name: transaction.user.firstName,
        last_name: transaction.user.lastName,
        email: transaction.user.email,
        phone: transaction.user.phoneNumber || null,
      },
      callbacks: {
        finish: `http://localhost:3000/?status=success&transactionId=${transaction.id}`, // sukses
        pending: `http://localhost:3000/?status=pending&transactionId=${transaction.id}`, // pending
        error: `http://localhost:3000/?status=error&transactionId=${transaction.id}`, // gagal
      },
    };

    const snapToken = await snap.createTransaction(snapPayload);

    res.status(200).json({
      token: snapToken.token,
      redirectUrl: snapToken.redirect_url,
    });
  } catch (error: any) {
    console.error("Error creating Midtrans Snap token:", error);
    res.status(500).json({
      message: "Failed to create Midtrans Snap token.",
      error: error.message,
    });
  }
};
