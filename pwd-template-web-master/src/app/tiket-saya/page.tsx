"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, X } from "lucide-react";
import QRCode from "react-qr-code";
import Link from "next/link";

interface IMyTicket {
  id: number;
  ticketCode: string;
  event: {
    title: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    imageUrl: string;
  };
  ticketType: {
    name: string;
  };
}

interface IMyTicketsResponse {
  message: string;
  tickets: IMyTicket[];
}

const MyTicketsPage = () => {
  const [myTickets, setMyTickets] = useState<IMyTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<IMyTicket | null>(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await api.get<IMyTicketsResponse>("/history/my-tickets");
        setMyTickets(res.data.tickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading tiket...</p>
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
      <section className="max-w-5xl mx-auto p-6 rounded-md shadow-xl bg-gray-50 text-gray-700">
        <h2 className="text-2xl font-bold py-4 mb-4 flex items-center gap-2">
          Tiket Saya
        </h2>

        {myTickets.length === 0 ? (
          <p>Belum ada tiket.</p>
        ) : (
          <div className="grid gap-6">
            {myTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="border-l-4 border-blue-600 flex flex-col md:flex-row overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="md:w-1/3">
                  <img
                    src={
                      ticket.event.imageUrl || "/img/logo/logo_EventUp_blue.png"
                    }
                    alt={ticket.event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-4 flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="font-bold text-lg">
                      {ticket.event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <span className="font-semibold">Kode Tiket:</span>{" "}
                      {ticket.ticketCode}
                    </p>
                    <p>
                      <span className="font-semibold">Jenis Tiket:</span>{" "}
                      {ticket.ticketType.name}
                    </p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(ticket.event.startDateTime).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(ticket.event.endDateTime).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.event.startDateTime).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(ticket.event.endDateTime).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    <p>
                      <span className="font-semibold">Lokasi:</span>{" "}
                      {ticket.event.location}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Tiket */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedTicket(null)}
              >
                <X />
              </button>
              <h3 className="text-xl font-bold mb-4">
                {selectedTicket.event.title}
              </h3>
              <p className="mb-2">
                <span className="font-semibold">Kode Tiket:</span>{" "}
                {selectedTicket.ticketCode}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Jenis Tiket:</span>{" "}
                {selectedTicket.ticketType.name}
              </p>
              <div className="flex justify-center mb-4">
                <QRCode value={selectedTicket.ticketCode} size={128} />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Tunjukkan QR code ini saat masuk ke acara.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyTicketsPage;
