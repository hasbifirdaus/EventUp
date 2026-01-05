"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  ArrowLeft,
  Minus,
  Plus,
  Ticket,
  Tag,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

type TicketType = {
  id: number;
  name: string;
  price: number;
  available: number;
  description: string;
  features: string[];
  originalPrice?: number;
};

type Promo = {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
};

const mockEventDetails = {
  1: {
    id: 1,
    title: "Tech Conference 2025",
    description:
      "Join the biggest tech conference of the year with industry leaders and innovators. This comprehensive event will cover the latest trends in artificial intelligence, blockchain technology, cloud computing, and digital transformation. Network with over 1000 professionals and gain insights from keynote speakers who are shaping the future of technology.",
    date: "2025-10-15",
    time: "09:00",
    endTime: "18:00",
    location: "Jakarta Convention Center",
    address: "Jl. Gatot Subroto, Senayan, Jakarta Selatan",
    category: "Technology",
    price: 500000,
    image: "/tech-conference.jpg",
    rating: 4.8,
    attendees: 1200,
    totalSeats: 1500,
    availableSeats: 300,
    organizer: "TechEvents Indonesia",
    features: [
      "Keynote speeches from industry leaders",
      "Interactive workshops and breakout sessions",
      "Networking lunch and coffee breaks",
      "Exhibition area with latest tech products",
      "Certificate of attendance",
      "Access to recorded sessions for 30 days",
    ],
    ticketTypes: [
      {
        id: 1,
        name: "Early Bird",
        price: 400000,
        originalPrice: 500000,
        available: 50,
        description: "Limited time offer - Save 20%",
        features: ["Standard access", "Welcome kit", "Lunch included"],
      },
      {
        id: 2,
        name: "Regular",
        price: 500000,
        available: 200,
        description: "Standard conference access",
        features: ["Standard access", "Welcome kit", "Lunch included"],
      },
      {
        id: 3,
        name: "VIP",
        price: 750000,
        available: 50,
        description: "Premium experience with exclusive benefits",
        features: [
          "Premium seating",
          "VIP lounge access",
          "Exclusive networking session",
          "Premium welcome kit",
          "All meals included",
        ],
      },
      {
        id: 4,
        name: "Business",
        price: 1000000,
        available: 25,
        description: "Corporate package for business professionals",
        features: [
          "Front row seating",
          "Private meeting rooms",
          "Dedicated concierge",
          "Premium catering",
          "Post-event materials",
        ],
      },
    ] as TicketType[],
    promos: [
      {
        code: "EARLYBIRD25",
        discount: 25,
        type: "percentage",
        description: "25% off for early registration",
      },
      {
        code: "STUDENT50",
        discount: 50000,
        type: "fixed",
        description: "Student discount",
      },
      {
        code: "REFERRAL15",
        discount: 15,
        type: "percentage",
        description: "Referral discount",
      },
    ],
    isPaid: true,
  },
  2: {
    id: 2,
    title: "Music Festival Summer",
    description:
      "Experience the best music festival with top artists from around the world. Three days of non-stop music across multiple stages featuring rock, pop, electronic, and indie artists.",
    date: "2025-11-20",
    time: "18:00",
    endTime: "23:00",
    location: "Gelora Bung Karno",
    address: "Jl. Pintu Satu Senayan, Jakarta Pusat",
    category: "Music",
    price: 750000,
    image: "/music-festival.avif",
    rating: 4.9,
    attendees: 5000,
    totalSeats: 8000,
    availableSeats: 3000,
    organizer: "Music Events Indonesia",
    features: [
      "3-day festival pass",
      "Multiple stages and artists",
      "Food and beverage vendors",
      "Merchandise booths",
      "VIP viewing areas available",
      "Free parking",
    ],
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 750000,
        available: 2000,
        description: "Standard festival access for all 3 days",
        features: [
          "3-day access",
          "General standing area",
          "Access to all stages",
        ],
      },
      {
        id: 2,
        name: "VIP Experience",
        price: 1500000,
        available: 500,
        description: "Premium festival experience",
        features: [
          "VIP viewing area",
          "Dedicated bar",
          "Premium restrooms",
          "Fast track entry",
          "VIP merchandise",
        ],
      },
      {
        id: 3,
        name: "Artist Meet & Greet",
        price: 2500000,
        available: 100,
        description: "Exclusive access to meet your favorite artists",
        features: [
          "All VIP benefits",
          "Backstage access",
          "Artist meet & greet",
          "Signed merchandise",
          "Photo opportunities",
        ],
      },
    ] as TicketType[],
    promos: [
      {
        code: "FESTIVAL20",
        discount: 20,
        type: "percentage",
        description: "Festival early bird discount",
      },
      {
        code: "GROUP10",
        discount: 10,
        type: "percentage",
        description: "Group booking discount (5+ tickets)",
      },
    ],
    isPaid: true,
  },
  3: {
    id: 3,
    title: "Food & Culinary Expo",
    description:
      "Discover amazing culinary experiences and taste the best food from local chefs. A celebration of Indonesian cuisine with cooking demonstrations and tastings.",
    date: "2025-12-05",
    time: "10:00",
    endTime: "20:00",
    location: "Senayan City",
    address: "Jl. Asia Afrika, Senayan, Jakarta Selatan",
    category: "Food",
    price: 150000,
    image: "/food-expo.jpg",
    rating: 4.7,
    attendees: 800,
    totalSeats: 1000,
    availableSeats: 200,
    organizer: "Culinary Indonesia",
    features: [
      "Free food tastings",
      "Cooking demonstrations",
      "Meet celebrity chefs",
      "Recipe sharing sessions",
      "Food photography workshop",
      "Kids cooking corner",
    ],
    ticketTypes: [
      {
        id: 1,
        name: "Regular Entry",
        price: 150000,
        available: 150,
        description: "Standard expo access with tastings",
        features: [
          "Basic expo access",
          "Free tastings",
          "Cooking demos viewing",
        ],
      },
      {
        id: 2,
        name: "VIP Foodie",
        price: 300000,
        available: 50,
        description: "Premium culinary experience",
        features: [
          "All regular benefits",
          "Chef meet & greet",
          "Premium tastings",
          "Recipe book",
          "VIP seating",
        ],
      },
    ] as TicketType[],
    promos: [
      {
        code: "FOODIE15",
        discount: 15,
        type: "percentage",
        description: "Food lover discount",
      },
    ],
    isPaid: true,
  },
  4: {
    id: 4,
    title: "Art Exhibition Modern",
    description:
      "Explore contemporary art from emerging and established artists. This exhibition showcases innovative works across various mediums including digital art, sculptures, paintings, and interactive installations. Meet the artists and learn about their creative processes.",
    date: "2025-10-30",
    time: "14:00",
    endTime: "21:00",
    location: "National Gallery",
    address: "Jl. Medan Merdeka Timur No.14, Jakarta Pusat",
    category: "Art",
    price: 100000,
    image: "/art-exhibition.png",
    rating: 4.6,
    attendees: 300,
    totalSeats: 500,
    availableSeats: 200,
    organizer: "Modern Art Society",
    features: [
      "Contemporary art exhibitions",
      "Artist meet and greet sessions",
      "Interactive art installations",
      "Art workshop participation",
      "Exhibition catalog included",
      "Photography allowed in designated areas",
    ],
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 100000,
        available: 150,
        description: "Standard exhibition access",
        features: ["Exhibition access", "Audio guide", "Exhibition map"],
      },
      {
        id: 2,
        name: "Art Enthusiast",
        price: 200000,
        available: 50,
        description: "Enhanced art experience with workshops",
        features: [
          "All general benefits",
          "Art workshop",
          "Artist Q&A session",
          "Exhibition catalog",
          "Priority viewing",
        ],
      },
    ] as TicketType[],
    promos: [
      {
        code: "ARTLOVER20",
        discount: 20,
        type: "percentage",
        description: "Art lover discount",
      },
      {
        code: "STUDENT30",
        discount: 30000,
        type: "fixed",
        description: "Student discount",
      },
    ],
    isPaid: true,
  },
  5: {
    id: 5,
    title: "Business Summit 2025",
    description:
      "Network with business leaders and learn about the latest industry trends. This summit brings together entrepreneurs, executives, and thought leaders to discuss innovation, leadership, and business growth strategies in the digital age.",
    date: "2025-11-10",
    time: "08:00",
    endTime: "17:00",
    location: "Grand Hyatt Jakarta",
    address: "Jl. M.H. Thamrin Kav. 28-30, Jakarta Pusat",
    category: "Business",
    price: 1000000,
    image: "/business-summit.png",
    rating: 4.8,
    attendees: 600,
    totalSeats: 800,
    availableSeats: 200,
    organizer: "Business Leaders Association",
    features: [
      "Keynote from industry leaders",
      "Panel discussions and workshops",
      "Networking lunch and breaks",
      "Business card exchange sessions",
      "Digital resource library access",
      "Certificate of participation",
    ],
    ticketTypes: [
      {
        id: 1,
        name: "Early Bird",
        price: 800000,
        originalPrice: 1000000,
        available: 50,
        description: "Limited early bird pricing - Save 20%",
        features: [
          "Standard summit access",
          "Welcome kit",
          "Lunch included",
          "Networking sessions",
        ],
      },
      {
        id: 2,
        name: "Professional",
        price: 1000000,
        available: 100,
        description: "Standard business summit access",
        features: [
          "Standard summit access",
          "Welcome kit",
          "Lunch included",
          "Networking sessions",
        ],
      },
      {
        id: 3,
        name: "Executive",
        price: 1500000,
        available: 50,
        description: "Premium executive experience",
        features: [
          "Premium seating",
          "Executive lounge access",
          "Private networking dinner",
          "One-on-one mentoring session",
          "Premium welcome package",
        ],
      },
    ] as TicketType[],
    promos: [
      {
        code: "BUSINESS25",
        discount: 25,
        type: "percentage",
        description: "Business professional discount",
      },
      {
        code: "STARTUP50",
        discount: 50000,
        type: "fixed",
        description: "Startup founder discount",
      },
      {
        code: "CORPORATE15",
        discount: 15,
        type: "percentage",
        description: "Corporate group discount",
      },
    ],
    isPaid: true,
  },
  6: {
    id: 6,
    title: "Sports Championship",
    description:
      "Watch the most exciting sports championship with world-class athletes. Experience thrilling competitions across multiple sports disciplines including basketball, volleyball, and badminton. Cheer for your favorite teams and athletes in this spectacular sporting event.",
    date: "2025-12-15",
    time: "19:00",
    endTime: "22:00",
    location: "Istora Senayan",
    address: "Jl. Pintu Satu Senayan, Jakarta Pusat",
    category: "Sports",
    price: 300000,
    image: "/sport-championship-celebration.jpg",
    rating: 4.9,
    attendees: 2000,
    totalSeats: 3000,
    availableSeats: 1000,
    organizer: "Indonesian Sports Federation",
    features: [
      "Multi-sport championship events",
      "World-class athlete competitions",
      "Live commentary and analysis",
      "Food and beverage concessions",
      "Merchandise and souvenir shops",
      "Photo opportunities with athletes",
    ],
    ticketTypes: [
      {
        id: 1,
        name: "General Seating",
        price: 300000,
        available: 800,
        description: "Standard championship viewing",
        features: [
          "General seating area",
          "Event program",
          "Access to concessions",
        ],
      },
      {
        id: 2,
        name: "Premium Seats",
        price: 500000,
        available: 200,
        description: "Better viewing experience with premium amenities",
        features: [
          "Premium seating",
          "Complimentary refreshments",
          "Priority entry",
          "Event merchandise",
          "Meet & greet opportunity",
        ],
      },
      {
        id: 3,
        name: "VIP Experience",
        price: 750000,
        available: 50,
        description: "Ultimate sports championship experience",
        features: [
          "VIP seating with best views",
          "VIP lounge access",
          "Premium catering",
          "Exclusive athlete meet & greet",
          "Signed memorabilia",
          "Private parking",
        ],
      },
    ] as TicketType[],
    promos: [
      {
        code: "SPORTS20",
        discount: 20,
        type: "percentage",
        description: "Sports fan discount",
      },
      {
        code: "FAMILY10",
        discount: 10,
        type: "percentage",
        description: "Family package discount (4+ tickets)",
      },
      {
        code: "EARLYBIRD30",
        discount: 30000,
        type: "fixed",
        description: "Early bird special",
      },
    ],
    isPaid: true,
  },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  if (!params || !params.id) {
    throw new Error("Event ID not found");
  }
  const eventId = Number.parseInt(params.id as string);
  const event = mockEventDetails[eventId as keyof typeof mockEventDetails];

  const [selectedTicketType, setSelectedTicketType] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState("");

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <Button onClick={() => router.push("/")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const selectedTicket = event.ticketTypes[selectedTicketType];
  const subtotal = selectedTicket.price * quantity;
  let discount = 0;

  if (appliedPromo) {
    if (appliedPromo.type === "percentage") {
      discount = (subtotal * appliedPromo.discount) / 100;
    } else {
      discount = appliedPromo.discount * quantity;
    }
  }

  const totalPrice = Math.max(0, subtotal - discount);

  const applyPromoCode = () => {
    const promo = event.promos.find(
      (p) => p.code.toLowerCase() === promoCode.toLowerCase()
    );
    if (promo) {
      setAppliedPromo(promo as Promo);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Ticket className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EventUp</span>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Image */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-blue-600 text-white">
                          {event.category}
                        </Badge>
                        {!event.isPaid && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Free Event
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </CardTitle>
                      <p className="text-gray-600">
                        Organized by {event.organizer}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{event.rating}</span>
                      <span className="text-gray-500">
                        ({event.attendees} attendees)
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">Date</p>
                          <p className="text-gray-600">
                            {new Date(event.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">Time</p>
                          <p className="text-gray-600">
                            {event.time} - {event.endTime} WIB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold">Location</p>
                          <p className="text-gray-600">{event.location}</p>
                          <p className="text-sm text-gray-500">
                            {event.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">Capacity</p>
                          <p className="text-gray-600">
                            {event.availableSeats} seats available of{" "}
                            {event.totalSeats}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      About This Event
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {event.description}
                    </p>

                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2">
                      {event.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center space-x-2">
                    <Ticket className="w-5 h-5" />
                    <span>
                      {event.isPaid ? "Book Your Tickets" : "Reserve Your Spot"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ticket Type Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Select Ticket Type</h4>
                    <div className="space-y-3">
                      {event.ticketTypes.map((ticket, index) => (
                        <div
                          key={ticket.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedTicketType === index
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedTicketType(index)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-semibold">{ticket.name}</p>
                                {ticket.originalPrice && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-red-100 text-red-800 text-xs"
                                  >
                                    <Percent className="w-3 h-3 mr-1" />
                                    Save{" "}
                                    {Math.round(
                                      ((ticket.originalPrice - ticket.price) /
                                        ticket.originalPrice) *
                                        100
                                    )}
                                    %
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {ticket.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {ticket.available} tickets available
                              </p>
                            </div>
                            <div className="text-right">
                              {ticket.originalPrice && (
                                <p className="text-sm text-gray-400 line-through">
                                  {formatPrice(ticket.originalPrice)}
                                </p>
                              )}
                              <p className="font-bold text-blue-600">
                                {formatPrice(ticket.price)}
                              </p>
                            </div>
                          </div>
                          {ticket.features && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <ul className="text-xs text-gray-600 space-y-1">
                                {ticket.features.map((feature, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center space-x-1"
                                  >
                                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Quantity</h4>
                    <div className="flex items-center space-x-3 text-white">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setQuantity(
                            Math.min(selectedTicket.available, quantity + 1)
                          )
                        }
                        disabled={quantity >= selectedTicket.available}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Max {selectedTicket.available} tickets per order
                    </p>
                  </div>

                  {/* Promo Code Section */}
                  {event.isPaid && event.promos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center space-x-2">
                        <Tag className="w-4 h-4" />
                        <span>Promo Code</span>
                      </h4>
                      {!appliedPromo ? (
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter promo code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              onClick={applyPromoCode}
                              disabled={!promoCode}
                              className="text-white"
                            >
                              Apply
                            </Button>
                          </div>
                          {promoError && (
                            <p className="text-sm text-red-600">{promoError}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            <p className="font-medium mb-1">
                              Available promos:
                            </p>
                            {event.promos.map((promo, idx) => (
                              <p key={idx}>
                                • {promo.code} - {promo.description}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-green-800">
                                {appliedPromo.code}
                              </p>
                              <p className="text-sm text-green-600">
                                {appliedPromo.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={removePromo}
                              className="text-green-600"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ticket Price</span>
                      <span>{formatPrice(selectedTicket.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity</span>
                      <span>{quantity}</span>
                    </div>
                    {subtotal > 0 && (
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                    )}
                    {appliedPromo && discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedPromo.code})</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    disabled={selectedTicket.available === 0}
                  >
                    {selectedTicket.available === 0
                      ? "Sold Out"
                      : event.isPaid
                      ? "Proceed to Checkout"
                      : "Reserve Now"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    {event.isPaid
                      ? "Secure payment processing"
                      : "Free registration - no payment required"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
