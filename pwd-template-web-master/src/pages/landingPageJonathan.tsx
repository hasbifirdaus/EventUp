"use client";
import Link from "next/link";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Calendar,
  Users,
  Star,
  Filter,
  ChevronDown,
  Ticket,
  Grid3X3,
  List,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Mock event data
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2025",
    description:
      "Join the biggest tech conference of the year with industry leaders and innovators.",
    date: "2025-10-15",
    time: "09:00",
    location: "Jakarta Convention Center",
    category: "Technology",
    price: 500000,
    image: "/tech-conference.jpg",
    rating: 4.8,
    attendees: 1200,
  },
  {
    id: 2,
    title: "Music Festival Summer",
    description:
      "Experience the best music festival with top artists from around the world.",
    date: "2025-11-20",
    time: "18:00",
    location: "Gelora Bung Karno",
    category: "Music",
    price: 750000,
    image: "/music-festival.avif",
    rating: 4.9,
    attendees: 5000,
  },
  {
    id: 3,
    title: "Food & Culinary Expo",
    description:
      "Discover amazing culinary experiences and taste the best food from local chefs.",
    date: "2025-12-05",
    time: "10:00",
    location: "Senayan City",
    category: "Food",
    price: 150000,
    image: "/food-expo.jpg",
    rating: 4.7,
    attendees: 800,
  },
  {
    id: 4,
    title: "Art Exhibition Modern",
    description:
      "Explore contemporary art from emerging and established artists.",
    date: "2025-10-30",
    time: "14:00",
    location: "National Gallery",
    category: "Art",
    price: 100000,
    image: "/art-exhibition.png",
    rating: 4.6,
    attendees: 300,
  },
  {
    id: 5,
    title: "Business Summit 2025",
    description:
      "Network with business leaders and learn about the latest industry trends.",
    date: "2025-11-10",
    time: "08:00",
    location: "Grand Hyatt Jakarta",
    category: "Business",
    price: 1000000,
    image: "/business-summit.png",
    rating: 4.8,
    attendees: 600,
  },
  {
    id: 6,
    title: "Sports Championship",
    description:
      "Watch the most exciting sports championship with world-class athletes.",
    date: "2025-12-15",
    time: "19:00",
    location: "Istora Senayan",
    category: "Sports",
    price: 300000,
    image: "/sport-championship-celebration.jpg",
    rating: 4.9,
    attendees: 2000,
  },
];

const categories = [
  "All Categories",
  "Technology",
  "Music",
  "Food",
  "Art",
  "Business",
  "Sports",
];
const locations = [
  "All Locations",
  "Jakarta Convention Center",
  "Gelora Bung Karno",
  "Senayan City",
  "National Gallery",
  "Grand Hyatt Jakarta",
  "Istora Senayan",
];

const LandingPageJonathan = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const eventsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let filtered = mockEvents;

    if (debouncedSearch) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          event.description
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          event.location.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter(
        (event) => event.location === selectedLocation
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedLocation]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const eventsRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Discover Amazing Events
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-4 max-w-3xl mx-auto text-pretty">
              Find and book tickets for concerts, conferences, festivals, and
              more.
            </p>
            <p className="text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-pretty">
              Your next unforgettable experience is just a click away.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 mb-16">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">1000+ Events</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium">50K+ Happy Customers</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-100 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-balance">
                Feel the magic beyond
              </h2>

              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Cari event seru disini"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg rounded-full border-gray-300 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto justify-between min-w-[200px] bg-transparent"
                    >
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span>{selectedCategory}</span>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto justify-between min-w-[200px] bg-transparent"
                    >
                      <span>{selectedLocation}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]">
                    {locations.map((location) => (
                      <DropdownMenuItem
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                      >
                        {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={eventsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {filteredEvents.length > 0
                    ? `${filteredEvents.length} Events Found`
                    : "No Events Found"}
                </h3>
                {(selectedCategory !== "All Categories" ||
                  selectedLocation !== "All Locations" ||
                  debouncedSearch) && (
                  <p className="text-gray-600">
                    {debouncedSearch && `Search: "${debouncedSearch}"`}
                    {selectedCategory !== "All Categories" &&
                      ` • Category: ${selectedCategory}`}
                    {selectedLocation !== "All Locations" &&
                      ` • Location: ${selectedLocation}`}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center space-x-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center space-x-2"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>

            {paginatedEvents.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                      : "space-y-6 mb-12"
                  }
                >
                  {paginatedEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      {viewMode === "grid" ? (
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col text-white">
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              className="w-full h-full object-cover "
                            />
                            <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                              {event.category}
                            </Badge>
                          </div>
                          <CardHeader className="flex-shrink-0">
                            <h4 className="text-xl font-bold text-gray-900 line-clamp-2">
                              {event.title}
                            </h4>
                            <p className="text-gray-600 line-clamp-2">
                              {event.description}
                            </p>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(event.date).toLocaleDateString(
                                    "id-ID"
                                  )}{" "}
                                  • {event.time}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{event.rating}</span>
                                  <span className="text-gray-400">
                                    ({event.attendees})
                                  </span>
                                </div>
                                <span className="text-lg font-bold text-blue-600">
                                  {formatPrice(event.price)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex-shrink-0">
                            <Link
                              href={`/events/${event.id}`}
                              className="w-full"
                            >
                              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ) : (
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 aspect-video md:aspect-square relative overflow-hidden">
                              <img
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                              <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                                {event.category}
                              </Badge>
                            </div>
                            <div className="md:w-2/3 flex flex-col">
                              <CardHeader>
                                <h4 className="text-xl font-bold text-gray-900">
                                  {event.title}
                                </h4>
                                <p className="text-gray-600">
                                  {event.description}
                                </p>
                              </CardHeader>
                              <CardContent className="flex-grow">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(event.date).toLocaleDateString(
                                        "id-ID"
                                      )}{" "}
                                      • {event.time}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4" />
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span>{event.rating}</span>
                                    <span className="text-gray-400">
                                      ({event.attendees})
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-blue-600">
                                      {formatPrice(event.price)}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Link
                                  href={`/events/${event.id}`}
                                  className="w-full"
                                >
                                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                </Link>
                              </CardFooter>
                            </div>
                          </div>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedLocation("All Locations");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Ticket className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold">EventUp</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Discover amazing events and book tickets for concerts,
                conferences, festivals, and more. Your next unforgettable
                experience is just a click away.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({
                        top: eventsRef.current?.offsetTop || 0,
                        behavior: "smooth",
                      })
                    }
                    className="hover:text-white transition-colors"
                  >
                    Events
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    My Tickets
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create-event"
                    className="hover:text-white transition-colors"
                  >
                    Create Event
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                © 2025 EventUp. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageJonathan;
