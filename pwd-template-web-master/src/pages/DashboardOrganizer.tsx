"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/utils/api";
import Link from "next/link";
import {
  FaChartLine,
  FaTicketAlt,
  FaCalendarAlt,
  FaEdit,
  FaExchangeAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface StatEntry {
  day?: string;
  month?: string;
  year?: string;
  revenue: number;
  tickets: number;
}

// Interface yang disinkronkan dengan respons backend baru
interface DashboardData {
  totalEvents: number;
  totalDraftEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalTransactions: number;
  stats: {
    daily: StatEntry[];
    monthly: StatEntry[];
    yearly: StatEntry[];
  };
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

interface SummaryCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: React.ReactNode;
  currency?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  unit,
  icon,
  currency = false,
}) => (
  <motion.div
    className="grid gap-5 border-2 border-gray-200 p-6 rounded-md text-gray-700 flex-1 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
      <h4 className="font-semibold text-lg">{title}</h4>
      <div className="text-xl text-indigo-600">{icon}</div>
    </div>
    <div className="flex items-center gap-2">
      <p className="text-4xl font-bold">
        {currency ? formatCurrency(value) : value}
      </p>
      {unit && <p className="text-lg text-gray-500">{unit}</p>}
    </div>
  </motion.div>
);

export default function DashboardOrganizer() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<"daily" | "monthly" | "yearly">("monthly");
  const { user } = useAuthStore();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<DashboardData>("/dashboard/organizer");
      setDashboardData(response.data);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response?.data?.message === "string"
      ) {
        setError((err as any).response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        console.error("Error fetching dashboard data:", err);
        setError("Gagal memuat data dashboard.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError("Silakan login untuk melihat dashboard.");
    }
  }, [user, fetchDashboardData]);

  const formatLabel = (entry: StatEntry): string => {
    if (entry.day)
      return format(new Date(entry.day), "dd MMM yyyy", { locale: id });
    if (entry.month)
      return format(new Date(entry.month + "-01"), "MMMM yyyy", { locale: id });
    if (entry.year) return entry.year;
    return "";
  };

  return (
    <div
      id="dashboard-organizer"
      className="bg-gray-50 min-h-screen p-4 sm:p-8 lg:p-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Dashboard Organizer
        </motion.h1> */}
        <p className="text-gray-500 mb-12 text-center text-lg">
          Ringkasan performa event Anda
        </p>

        {loading && (
          <div className="flex justify-center items-center h-[50vh] flex-col">
            <div className="animate-spin h-12 w-12 text-indigo-600 border-4 border-current border-t-transparent rounded-full"></div>
            <p className="mt-4 text-lg text-gray-500">Memuat data dasbor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative text-center">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <Link
              href="/login"
              className="font-semibold ml-4 text-indigo-600 hover:underline"
            >
              Login Sekarang
            </Link>
          </div>
        )}

        {!loading && !error && dashboardData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Summary Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              <SummaryCard
                title="Total Event"
                value={dashboardData.totalEvents}
                unit="Event"
                icon={<FaCalendarAlt />}
              />
              <SummaryCard
                title="Event Draft"
                value={dashboardData.totalDraftEvents}
                unit="Event"
                icon={<FaEdit />}
              />
              <SummaryCard
                title="Total Tiket Terjual"
                value={dashboardData.totalTicketsSold}
                unit="Tiket"
                icon={<FaTicketAlt />}
              />
              <SummaryCard
                title="Total Transaksi"
                value={dashboardData.totalTransactions}
                unit="Transaksi"
                icon={<FaExchangeAlt />}
              />
              <SummaryCard
                title="Total Pendapatan"
                value={dashboardData.totalRevenue}
                currency={true}
                icon={<FaChartLine />}
              />
            </div>
            {/* ... Chart ... */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Statistik Penjualan
                </h2>
                <div className="flex gap-2">
                  {["daily", "monthly", "yearly"].map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setRange(r as "daily" | "monthly" | "yearly")
                      }
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        range === r
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {r === "daily"
                        ? "Harian"
                        : r === "monthly"
                        ? "Bulanan"
                        : "Tahunan"}
                    </button>
                  ))}
                </div>
              </div>

              {dashboardData.stats[range].length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData.stats[range].map((entry) => ({
                        ...entry,
                        label: formatLabel(entry),
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="label" stroke="#333" />
                      <YAxis stroke="#333" />
                      <Tooltip
                        formatter={(value, name) =>
                          name === "Pendapatan"
                            ? formatCurrency(value as number)
                            : value
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        name="Pendapatan"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="tickets"
                        stroke="#82ca9d"
                        name="Tiket Terjual"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] flex-col">
                  <p className="text-gray-400 text-lg text-center">
                    Tidak ada data statistik untuk periode yang dipilih.
                  </p>
                  <Link
                    href="/create-event"
                    className="mt-4 text-indigo-600 font-semibold hover:underline"
                  >
                    Buat Event Pertama Anda
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
