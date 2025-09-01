import { Request, Response } from "express";
import {
  PrismaClient,
  Transaction,
  TransactionItem,
} from "../generated/prisma";
import { format } from "date-fns";

const prisma = new PrismaClient();

export const getOrganizerDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    // Ambil semua event milik organizer beserta transaksi & tiket
    const events = await prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        transactions: {
          where: { status: "PAID" },
          include: { items: true },
        },
        tickets: true, // untuk hitung attendees
      },
    });

    let totalRevenue = 0;
    let totalTicketsSold = 0;

    const dailyStats: Record<string, { revenue: number; tickets: number }> = {};
    const monthlyStats: Record<string, { revenue: number; tickets: number }> =
      {};
    const yearlyStats: Record<string, { revenue: number; tickets: number }> =
      {};

    // Hitung statistik dari transaksi
    events.forEach((event) => {
      event.transactions.forEach(
        (transaction: Transaction & { items: TransactionItem[] }) => {
          const revenue = transaction.totalAmount.toNumber();
          const tickets = transaction.items.reduce(
            (sum: number, item: TransactionItem) => sum + item.quantity,
            0
          );

          totalRevenue += revenue;
          totalTicketsSold += tickets;

          const dayKey = format(new Date(transaction.createdAt), "yyyy-MM-dd");
          const monthKey = format(new Date(transaction.createdAt), "yyyy-MM");
          const yearKey = format(new Date(transaction.createdAt), "yyyy");

          if (!dailyStats[dayKey])
            dailyStats[dayKey] = { revenue: 0, tickets: 0 };
          dailyStats[dayKey].revenue += revenue;
          dailyStats[dayKey].tickets += tickets;

          if (!monthlyStats[monthKey])
            monthlyStats[monthKey] = { revenue: 0, tickets: 0 };
          monthlyStats[monthKey].revenue += revenue;
          monthlyStats[monthKey].tickets += tickets;

          if (!yearlyStats[yearKey])
            yearlyStats[yearKey] = { revenue: 0, tickets: 0 };
          yearlyStats[yearKey].revenue += revenue;
          yearlyStats[yearKey].tickets += tickets;
        }
      );
    });

    // Ubah objek statistik ke array
    const dailyStatsArray = Object.keys(dailyStats)
      .sort()
      .map((key) => ({
        day: key,
        ...dailyStats[key],
      }));

    const monthlyStatsArray = Object.keys(monthlyStats)
      .sort()
      .map((key) => ({
        month: key,
        ...monthlyStats[key],
      }));

    const yearlyStatsArray = Object.keys(yearlyStats)
      .sort()
      .map((key) => ({
        year: key,
        ...yearlyStats[key],
      }));

    res.status(200).json({
      message: "Data dashboard berhasil dimuat",
      totalEvents: events.length,
      totalTicketsSold,
      totalRevenue,
      stats: {
        daily: dailyStatsArray,
        monthly: monthlyStatsArray,
        yearly: yearlyStatsArray,
      },
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        attendees: event.tickets.filter((t) => t.status === "SOLD").length,
        transactions: event.transactions.length,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
