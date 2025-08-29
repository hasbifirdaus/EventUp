// src/controllers/dashboard.controller.ts

import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getOrganizerDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    //Ambil data statistik dati database
    const events = await prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        transactions: {
          include: {
            items: true,
          },
        },
      },
    });

    //Hitung total pendapatan dan tiket terjual
    let totalRevenue = 0;
    let totalTicketsSold = 0;

    events.forEach((event) => {
      event.transactions.forEach((transaction) => {
        totalRevenue += transaction.totalAmount.toNumber();

        //loop transactionItems untuk setiap transaksi -> untuk menghitung tiket
        if (transaction.items) {
          const ticketsCount = transaction.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          totalTicketsSold += ticketsCount;
        }
      });
    });

    res.status(200).json({
      message: "Data dasbor berhasil dimuat",
      totalEvents: events.length,
      totalTicketsSold,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
