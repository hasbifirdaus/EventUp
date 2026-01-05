import { Request, Response } from "express";
import prisma from "../utils/prisma";

// Mengambil semua transaksi untuk pengguna yang sedang login
export const getMyTransactions = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            title: true,
            imageUrl: true,
            location: true,
            startDateTime: true,
          },
        },
        items: {
          include: {
            ticketType: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
        promotionUsed: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Transaction history loaded successfully.",
      transactions,
    });
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve transaction history." });
  }
};

// Mengambil semua tiket yang dimiliki pengguna yang sedang login
export const getMyTickets = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const tickets = await prisma.ticket.findMany({
      where: { ownerId: userId },
      include: {
        event: {
          select: {
            title: true,
            imageUrl: true,
            location: true,
            startDateTime: true,
            endDateTime: true,
          },
        },
        ticketType: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res
      .status(200)
      .json({ message: "Ticket history loaded successfully.", tickets });
  } catch (error) {
    console.error("Error getting user tickets:", error);
    res.status(500).json({ message: "Failed to retrieve ticket history." });
  }
};
