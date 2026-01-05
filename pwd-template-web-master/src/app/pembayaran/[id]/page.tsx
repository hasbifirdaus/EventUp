"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Ticket,
  Calendar,
  Clock,
  Plus,
  Minus,
  Tag,
  Coins,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuthStore } from "@/stores/useAuthStore";
import { usePointStore } from "@/stores/usePointStore";
import { useCouponStore } from "@/stores/useCouponStore";

interface Event {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  imageUrl: string;
}

interface Ticket {
  id: number;
  name: string;
  description: string;
  price: number;
  quota: number;
  isAvailable: boolean;
  isSeated: boolean;
}

export default function PembayaranPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id;

  const user = useAuthStore((state) => state.user);
  const { totalPoints, fetchPoints } = usePointStore();
  const { coupons, fetchCoupons } = useCouponStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [promotionCode, setPromotionCode] = useState("");
  const [pointsUsed, setPointsUsed] = useState(0);

  // Fetch event & tickets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await api.get<Event>(`/events/${id}`);
        setEvent(eventRes.data);

        const ticketRes = await api.get<Ticket[]>(`/events/${id}/ticket-types`);
        setTickets(ticketRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Fetch points & coupons
  useEffect(() => {
    fetchPoints();
    fetchCoupons();
  }, [fetchPoints, fetchCoupons]);

  // Check transaction status
  useEffect(() => {
    const checkTransactionStatus = async () => {
      try {
        if (!id) return;

        const res = await api.get<{ status: string }>(
          `/transactions/${id}/status`
        );
        const status = res.data.status;

        if (status === "PAID") {
          toast.success("Transaksi sudah dibayar.");
          // router.push("/"); // redirect ke homepage atau halaman event
        } else if (status === "CANCELLED") {
          toast.warn("Transaksi dibatalkan. Silakan buat transaksi baru.");
          // router.push("/");
        }
        // pending -> biarkan user checkout
      } catch (err) {
        console.error("Error fetching transaction status:", err);
      }
    };

    checkTransactionStatus();
  }, [id, router]);

  // Handle toast for query params (status)
  useEffect(() => {
    if (!searchParams) return;

    const status = searchParams.get("status");
    if (!status) return;

    if (status === "success") {
      toast.success("Pembayaran berhasil!");
    } else if (status === "pending") {
      toast.info("Pembayaran masih pending.");
    } else if (status === "error") {
      toast.error("Pembayaran gagal. Silakan coba lagi.");
    }
  }, [searchParams]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const selected = tickets.find((t) => t.id === selectedTicket);
  let subtotal = selected ? selected.price * quantity : 0;

  subtotal -= pointsUsed; // diskon points
  if (promotionCode) {
    const coupon = coupons.find((c) => c.code === promotionCode);
    if (coupon) {
      const discountValue = parseInt(coupon.discount.replace("%", ""));
      if (!isNaN(discountValue)) {
        subtotal -= (subtotal * discountValue) / 100;
      }
    }
  }
  if (subtotal < 0) subtotal = 0;

  // Handle checkout
  const handleCheckout = async () => {
    if (!event || !selectedTicket) return alert("Pilih tiket dulu!");

    try {
      const createRes = await api.post<{ transactionId: number }>(
        "/transactions/create",
        {
          eventId: event.id,
          userId: user?.id,
          items: [
            {
              ticketTypeId: selectedTicket,
              quantity,
            },
          ],
          promotionCode,
          pointsUsed,
        }
      );

      const transactionId = createRes.data.transactionId;
      const snapRes = await api.post<{ token: string; redirectUrl: string }>(
        "/transactions/create-snap-token",
        { transactionId }
      );

      window.location.href = snapRes.data.redirectUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Terjadi kesalahan saat checkout.");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Button>
            <div className="flex items-center space-x-3">
              <Ticket className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold">EventUp</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Image */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={event.imageUrl || "/img/event/placeholder-event.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">
                    {event.title}
                  </CardTitle>
                  <p className="text-gray-600">{event.location}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>
                        {new Date(event.startDateTime).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>
                        {new Date(event.startDateTime).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(event.endDateTime).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{event.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Checkout */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center space-x-2">
                    <Ticket className="w-5 h-5" />
                    <span>Book Your Ticket</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ticket List */}
                  <div>
                    <h4 className="font-semibold mb-3">Select Ticket</h4>
                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-3 border rounded-lg cursor-pointer ${
                            selectedTicket === ticket.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedTicket(ticket.id);
                            setQuantity(1);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{ticket.name}</p>
                              <p className="text-sm text-gray-600">
                                {ticket.description}
                              </p>
                            </div>
                            <p className="font-bold text-blue-600">
                              {formatPrice(ticket.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  {selected && (
                    <div className="text-white">
                      <h4 className="text-gray-600 font-semibold mb-3">
                        Quantity
                      </h4>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-lg text-black font-semibold">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={quantity >= selected.quota}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span>Pilih Kupon</span>
                    </h4>
                    <Select
                      onValueChange={(val) => setPromotionCode(val)}
                      value={promotionCode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kupon aktif" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-400">
                        <SelectItem value="tidak menggunakan Kupon">
                          Tidak menggunakan kupon
                        </SelectItem>
                        {coupons
                          .filter((c) => new Date(c.validUntil) > new Date())
                          .map((coupon, i) => (
                            <SelectItem key={i} value={coupon.code}>
                              {coupon.code} - {coupon.discount}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Points */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span>Gunakan Poin</span>
                    </h4>
                    <p className="text-sm text-gray-500 mb-1">
                      Total poin Anda:{" "}
                      <span className="font-semibold">
                        {totalPoints?.toLocaleString() ?? 0}
                      </span>
                    </p>
                    <Input
                      type="number"
                      value={pointsUsed}
                      onChange={(e) =>
                        setPointsUsed(
                          Math.min(
                            Math.max(0, Number(e.target.value)),
                            totalPoints
                          )
                        )
                      }
                      placeholder="Jumlah poin"
                    />
                  </div>

                  <Separator />

                  {/* Price Summary */}
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    onClick={handleCheckout}
                    disabled={!selected}
                  >
                    {selected ? "Proceed to Checkout" : "Select Ticket First"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
