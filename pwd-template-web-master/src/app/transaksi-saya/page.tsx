"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CreditCard } from "lucide-react";
import Link from "next/link";

// Interface untuk item transaksi
interface ITransactionItem {
  id: number;
  quantity: number;
  unitPrice?: string;
  ticketType?: { name?: string };
}

// Interface untuk kupon yang digunakan
interface IPromotionUsed {
  id: number;
  name?: string;
  code?: string;
}

// Interface untuk transaksi
interface ITransaction {
  id: number;
  status: string; // PAID, PENDING, CANCELLED
  createdAt: string;
  totalAmount: string;
  pointUsed?: number | null;
  promotionUsed?: IPromotionUsed | null;
  event: {
    title: string;
    location: string;
    startDateTime: string;
    imageUrl?: string;
  };
  items: ITransactionItem[];
}

// Response dari API
interface ITransactionsResponse {
  message: string;
  transactions: ITransaction[];
}

const MyTransactionsPage = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get<ITransactionsResponse>(
          "/history/my-transactions"
        );
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transaksi berdasarkan status
  const filteredTransactions = transactions.filter((tx) =>
    filterStatus === "ALL" ? true : tx.status === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading transaksi...</p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white min-h-screen">
      <Link className="p-10 cursor-pointer" href="/">
        <button className="bg-blue-700 max-w-56 text-white rounded-full p-3">
          Back
        </button>
      </Link>
      <section className="max-w-4xl mx-auto p-6 rounded-md shadow-xl bg-gray-50 text-gray-700">
        <h2 className="text-2xl font-bold py-4 mb-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-green-600" /> Transaksi Saya
        </h2>

        {/* Filter Status */}
        <div className="mb-6 flex gap-2">
          {["ALL", "PAID", "PENDING", "CANCELLED"].map((status) => (
            <button
              key={status}
              className={`px-4 py-1 rounded-md border ${
                filterStatus === status
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredTransactions.length === 0 ? (
          <p>kalo bisa tiketnya di beli yah 🫠.</p>
        ) : (
          <div className="grid gap-4">
            {filteredTransactions.map((tx) => {
              const isPaid = tx.status === "PAID";
              const borderColor =
                tx.status === "PAID"
                  ? "border-green-600"
                  : tx.status === "PENDING"
                  ? "border-yellow-500"
                  : "border-red-500"; // CANCELLED

              return (
                <Card key={tx.id} className={`border-l-4 ${borderColor}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{tx.event.title}</span>
                      <span
                        className={`text-sm font-medium ${
                          tx.status === "PAID"
                            ? "text-green-600"
                            : tx.status === "PENDING"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="grid gap-1">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(tx.event.startDateTime).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(tx.event.startDateTime).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    <p>
                      <span className="font-semibold">Lokasi:</span>{" "}
                      {tx.event.location}
                    </p>

                    <div className="mt-2 grid gap-2">
                      <span className="font-semibold">Tiket Dibeli:</span>
                      <ul className="list-disc ml-5">
                        {tx.items.map((item) => {
                          const totalPrice = isPaid
                            ? parseInt(item.unitPrice || "0") * item.quantity
                            : 0;
                          return (
                            <li key={item.id}>
                              {item.ticketType?.name ??
                                "Jenis tiket tidak diketahui"}{" "}
                              x{item.quantity} - Rp{" "}
                              {totalPrice.toLocaleString("id-ID")}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {tx.pointUsed ? (
                      <p className="mt-2 text-sm text-blue-600">
                        Poin Digunakan: {tx.pointUsed}
                      </p>
                    ) : null}

                    {tx.promotionUsed &&
                    (tx.promotionUsed.name || tx.promotionUsed.code) ? (
                      <p className="mt-1 text-sm text-purple-600">
                        Kupon Digunakan:{" "}
                        {tx.promotionUsed.name ? tx.promotionUsed.name : ""}
                        {tx.promotionUsed.code
                          ? ` (${tx.promotionUsed.code})`
                          : ""}
                      </p>
                    ) : null}

                    <p className="mt-2 font-semibold">Transaksi: {tx.id}</p>
                    <p className="mt-1 font-semibold">
                      Total: Rp{" "}
                      {isPaid
                        ? parseInt(tx.totalAmount).toLocaleString("id-ID")
                        : "0"}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Dibuat pada:{" "}
                      {new Date(tx.createdAt).toLocaleString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyTransactionsPage;
