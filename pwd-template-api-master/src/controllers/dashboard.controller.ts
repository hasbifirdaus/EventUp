import { Response } from "express";
import prisma from "../utils/prisma";
import { format } from "date-fns";
import { TransactionStatusEnum } from "../../src/generated/prisma";

export const getOrganizerDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId; // 1. Hitung total event aktif dan draft

    const totalEvents = await prisma.event.count({
      where: { organizerId: userId },
    }); // Kita asumsikan event 'draft' adalah event dengan isActive: false

    const totalDraftEvents = await prisma.event.count({
      where: { organizerId: userId, isActive: false },
    }); // 2. Hitung statistik transaksi, tiket terjual, dan pendapatan

    const stats = await prisma.transaction.groupBy({
      by: ["createdAt"],
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        event: { organizerId: userId },
        status: "PAID",
      },
      orderBy: {
        createdAt: "asc",
      },
    }); // Hitung total transaksi dan total pendapatan

    const totalTransactions = await prisma.transaction.count({
      where: {
        event: { organizerId: userId },
        status: "PAID",
      },
    });
    const totalRevenueResult = await prisma.transaction.aggregate({
      _sum: { totalAmount: true },
      where: {
        event: { organizerId: userId },
        status: "PAID",
      },
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount?.toNumber() || 0;

    const totalTicketsSoldResult = await prisma.transactionItem.aggregate({
      _sum: { quantity: true },
      where: {
        transaction: {
          event: { organizerId: userId },
          status: "PAID",
        },
      },
    });
    const totalTicketsSold = totalTicketsSoldResult._sum.quantity || 0; // Format data statistik untuk grafik

    const dailyStats = stats.map((s) => ({
      day: format(s.createdAt, "yyyy-MM-dd"),
      revenue: s._sum.totalAmount?.toNumber() || 0,
      tickets: 0, // Perlu dihitung secara terpisah jika ingin akurat
    })); // NOTE: Menghitung tiket per hari/bulan/tahun membutuhkan join yang kompleks.
    // Untuk saat ini, kita akan fokus pada agregasi total.
    // 3. Kirim data lengkap ke frontend
    res.status(200).json({
      message: "Data dashboard berhasil dimuat",
      totalEvents,
      totalDraftEvents,
      totalTicketsSold,
      totalRevenue,
      totalTransactions,
      stats: {
        daily: dailyStats, // Anda bisa menambahkan logika untuk bulanan dan tahunan di sini
        monthly: [],
        yearly: [],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
