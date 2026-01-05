"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  imageUrl: string | null;
  category: string;
  organizerId: number;
}

const ITEMS_PER_PAGE = 10;

export default function JelajahEvent() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get<Event[]>("/events");
        setAllEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setError("Gagal memuat data event. Silakan coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Efek untuk melakukan debouncing pada pencarian
  useEffect(() => {
    // Reset halaman ke 1 setiap kali query berubah
    setCurrentPage(1);

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredEvents(allEvents); // Jika query kosong, tampilkan semua event
      } else {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const results = allEvents.filter((event) =>
          event.title.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredEvents(results);
      }
    }, 500); // Debounce selama 500ms

    // Cleanup function: Hapus timer jika component unmount atau query berubah
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, allEvents]);

  // Logika Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const eventsToShow = filteredEvents.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  if (loading) {
    return (
      <section id="jelajah-event" className="bg-gray-300 min-h-screen p-10">
        <h1 className="font-bold text-3xl p-4">Event</h1>
        <p className="p-4 text-center">Memuat data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="jelajah-event" className="bg-gray-300 min-h-screen p-10">
        <h1 className="font-bold text-3xl p-4">Event</h1>
        <p className="p-4 text-center text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section id="jelajah-event" className="bg-white min-h-screen p-10">
      <h1 className="font-bold text-3xl p-4">Event</h1>
      <div className="px-4">
        <input
          className="border-2 p-2 w-2xl rounded-md"
          type="text"
          placeholder="Jelajahi Event Seru"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div
        id="container-box-event"
        className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {eventsToShow.length > 0 ? (
          eventsToShow.map((event) => (
            <Link key={event.id} href={`/pembayaran/${event.id}`}>
              <div className="bg-blue-700 rounded-md overflow-hidden shadow-lg text-gray-100">
                <img
                  className="w-full h-48 object-cover rounded-t-md "
                  src={
                    event.imageUrl && event.imageUrl.trim() !== ""
                      ? event.imageUrl
                      : "/img/event/placeholder-event.jpg"
                  }
                  alt={event.title}
                />
                <div className="p-3 grid gap-2">
                  <h2 className="font-semibold text-lg truncate">
                    {event.title}
                  </h2>
                  <h3 className="text-sm ">
                    {new Date(event.startDateTime).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-gray-700">
            Tidak ada event yang ditemukan.
          </p>
        )}
      </div>

      {/* Navigasi Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center p-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            &larr; Sebelumnya
          </button>
          <span className="px-4 py-2 mx-1">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Berikutnya &rarr;
          </button>
        </div>
      )}
    </section>
  );
}
