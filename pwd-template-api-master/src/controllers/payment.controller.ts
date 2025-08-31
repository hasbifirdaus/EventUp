import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { snap } from "../config/midtrans.config";

export const createSnapPaymentToken = async (req: Request, res: Response) => {
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
            ticketType: true,
          },
        },
        user: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const itemDetails = transaction.items.map((item) => ({
      id: `TICKET-${item.ticketTypeId}`,
      name: item.ticketType.name,
      price: item.unitPrice.toNumber(),
      quantity: item.quantity,
    }));

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
