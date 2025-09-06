"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StatEntry {
  day?: string;
  month?: string;
  year?: string;
  revenue: number;
  tickets: number;
}

interface DashboardData {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
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

export default function DashboardOrganizer() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<"daily" | "monthly" | "yearly">("monthly");

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mengakses state Zustand hanya setelah terhidrasi di sisi klien
  useEffect(() => {
    const { accessToken, _hasHydrated } = useAuthStore.getState();
    setAccessToken(accessToken);
    setIsHydrated(_hasHydrated);

    const unsubscribe = useAuthStore.subscribe((state) => {
      setAccessToken(state.accessToken);
      setIsHydrated(state._hasHydrated);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        if (!accessToken) {
          // Ganti useRouter dengan navigasi langsung
          window.location.href = "/";
          return;
        }

        const response = await axios.get<DashboardData>(
          "http://localhost:8000/api/dashboard/organizer",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setDashboardData(response.data);
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.message || "Gagal memuat data dashboard.");
        } else {
          setError("Terjadi kesalahan. Silakan coba lagi.");
        }
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [accessToken, isHydrated]);

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
      className="bg-white min-h-screen grid items-center p-4 sm:p-6 lg:p-15"
    >
      <div
        id="dashboard-organizer-events"
        className="mb-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
      >
        {/*1. Event Aktif */}
        <div
          id="dashboard-organizer-events-box"
          className="grid gap-5 border-2 border-gray-400  p-6 rounded-md text-gray-400 flex-1"
        >
          <div
            id=""
            className="flex items-center justify-between border-b-2 border-gray-200 pb-2"
          >
            <h4>Event Aktif</h4>
            <Link href="#" className="text-red-500 text-xs">
              Detail
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <p
              id="dashboard-organizer-eventd-active-number"
              className="text-4xl"
            >
              0
            </p>
            <p className="text-lg">Event</p>
          </div>
        </div>

        {/*2. Event Draft */}
        <div
          id="dashboard-organizer-events-box"
          className="grid gap-5 border-2 border-gray-400  p-6 rounded-md text-gray-400 flex-1"
        >
          <div
            id=""
            className="flex items-center justify-between border-b-2 border-gray-200 pb-2"
          >
            <h4>Event Draft</h4>
            <Link href="#" className="text-red-500 text-xs">
              Detail
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <p
              id="dashboard-organizer-eventd-active-number"
              className="text-4xl"
            >
              0
            </p>
            <p className="text-lg">Event</p>
          </div>
        </div>

        {/*3. Total Transaksi */}

        <div
          id="dashboard-organizer-events-box"
          className="grid gap-5 border-2 border-gray-400  p-6 rounded-md text-gray-400 flex-1"
        >
          <div
            id=""
            className="flex items-center justify-between border-b-2 border-gray-200 pb-2"
          >
            <h4>Total Transaksi</h4>
          </div>
          <div className="flex items-center gap-2">
            <p
              id="dashboard-organizer-eventd-active-number"
              className="text-4xl"
            >
              0
            </p>
          </div>
        </div>

        {/*4. Total Tiket Terjual */}

        <div
          id="dashboard-organizer-events-box"
          className="grid gap-5 border-2 border-gray-400  p-6 rounded-md text-gray-400 flex-1"
        >
          <div
            id=""
            className="flex items-center justify-between border-b-2 border-gray-200 pb-2"
          >
            <h4>Total Tiket Terjual</h4>
          </div>
          <div className="flex items-center gap-2">
            <p
              id="dashboard-organizer-eventd-active-number"
              className="text-4xl"
            >
              0
            </p>
            <p className="text-lg">Tiket</p>
          </div>
        </div>

        {/*5. Total Penjualan */}
        <div
          id="dashboard-organizer-events-box"
          className="grid gap-5 border-2 border-gray-400  p-6 rounded-md text-gray-400 flex-1"
        >
          <div
            id=""
            className="flex items-center justify-between border-b-2 border-gray-200 pb-2"
          >
            <h4>Total Penjualan</h4>
          </div>
          <div className="flex items-center gap-2">
            <p
              id="dashboard-organizer-eventd-active-number"
              className="text-4xl"
            >
              <span className="mr-2">Rp</span> 0
            </p>
          </div>
        </div>

        {/*6. Total Pengunjung */}
        <div
          id="dashboard-organizer-events-box"
          className="grid gap-5 border-2 border-gray-400  p-6 rounded-md text-gray-400 flex-1"
        >
          <div
            id=""
            className="flex items-center justify-between border-b-2 border-gray-200 pb-2"
          >
            <h4>Total Pengunjung</h4>
          </div>
          <div className="flex items-center gap-2">
            <p
              id="dashboard-organizer-eventd-active-number"
              className="text-4xl"
            >
              0
            </p>
            <p className="text-lg">Orang</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-[75rem] border border-gray-100 mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
          Dashboard Organizer
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Ringkasan performa event Anda
        </p>

        {loading && (
          <div className="text-gray-500 flex flex-col items-center">
            <div className="animate-spin h-10 w-10 text-indigo-600 border-4 border-current border-t-transparent rounded-full"></div>
            <p className="mt-4 text-lg">Memuat data dasbor...</p>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {dashboardData && (
          <div>
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-lg font-semibold opacity-90">
                  Total Pendapatan
                </p>
                <p className="text-4xl sm:text-5xl font-bold mt-2">
                  {formatCurrency(dashboardData.totalRevenue)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-lg font-semibold opacity-90">
                  Total Tiket Terjual
                </p>
                <p className="text-4xl sm:text-5xl font-bold mt-2">
                  {dashboardData.totalTicketsSold}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-lg font-semibold opacity-90">Jumlah Event</p>
                <p className="text-4xl sm:text-5xl font-bold mt-2">
                  {dashboardData.totalEvents}
                </p>
              </div>
            </div>

            {/* Range selector */}
            <div className="flex gap-4 mb-6 justify-center">
              {["daily", "monthly", "yearly"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r as "daily" | "monthly" | "yearly")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
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

            {/* Chart */}
            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Statistik{" "}
                {range === "daily"
                  ? "Harian"
                  : range === "monthly"
                  ? "Bulanan"
                  : "Tahunan"}
              </h2>
              {dashboardData.stats[range].length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={dashboardData.stats[range].map((entry) => ({
                      ...entry,
                      label: formatLabel(entry),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) =>
                        name === "revenue"
                          ? formatCurrency(value as number)
                          : value
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4F46E5"
                      name="Pendapatan"
                    />
                    <Line
                      type="monotone"
                      dataKey="tickets"
                      stroke="#10B981"
                      name="Tiket Terjual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-lg text-center">
                  Tidak ada data statistik {range}.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
