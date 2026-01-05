"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/utils/api";
import {
  FaCalendarPlus,
  FaPen,
  FaCheckCircle,
  FaHistory,
} from "react-icons/fa";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface IEvent {
  id: number;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
}

interface IEventsResponse {
  activeEvents: IEvent[];
  draftEvents: IEvent[];
  pastEvents: IEvent[];
}

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "past">(
    "active"
  );
  const [events, setEvents] = useState<IEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<IEventsResponse>("/events/organizer");
      setEvents(response.data);
    } catch (err) {
      setError("Gagal memuat event. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const renderEventList = (
    eventList: IEvent[],
    noDataMessage: string,
    type: "draft" | "active" | "past"
  ) => {
    if (loading) {
      return (
        <div className="p-6 text-center text-gray-500">Memuat event...</div>
      );
    }
    if (error) {
      return <div className="p-6 text-center text-red-500">{error}</div>;
    }
    if (!eventList || eventList.length === 0) {
      return (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-600">
          <p className="mb-2">{noDataMessage}</p>{" "}
          <Link
            href="/create-event"
            className="text-blue-600 hover:underline font-medium"
          >
            Buat Event Baru Sekarang{" "}
          </Link>{" "}
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {" "}
        {eventList.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 transition hover:shadow-md"
          >
            {" "}
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
              {event.name}
            </h3>{" "}
            <p className="text-sm text-gray-500 mt-1">
              {" "}
              <span className="font-semibold text-gray-700">Tanggal:</span>{" "}
              {format(new Date(event.startDateTime), "dd MMMM yyyy HH:mm", {
                locale: id,
              })}{" "}
            </p>{" "}
            <p className="text-sm text-gray-500 mt-1">
              {" "}
              <span className="font-semibold text-gray-700">Lokasi:</span>{" "}
              {event.location}{" "}
            </p>{" "}
            <div className="mt-4 flex gap-2">
              {" "}
              {type === "draft" && (
                <Link
                  href={`/events/edit/${event.id}`}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <FaPen className="inline mr-1" /> Edit{" "}
                </Link>
              )}{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>
    );
  };

  const tabs = [
    { name: "Event Aktif", id: "active", icon: <FaCheckCircle /> },
    { name: "Event Draft", id: "draft", icon: <FaPen /> },
    { name: "Event Lalu", id: "past", icon: <FaHistory /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        {/* <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Event Saya
        </h1> */}
        {/* Tab Navigation */}{" "}
        <div className="flex justify-center border-b border-gray-200 mb-8">
          {" "}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "active" | "draft" | "past")
              }
              className={`px-6 py-3 font-medium cursor-pointer transition-all duration-300 flex items-center gap-2
  ${
    activeTab === tab.id
      ? "text-blue-600 border-b-2 border-blue-600"
      : "text-gray-500 hover:text-gray-700"
  }`}
            >
              {tab.icon} {tab.name}{" "}
            </button>
          ))}{" "}
        </div>
        {/* Tab Content */}{" "}
        <div className="mt-6">
          {" "}
          {activeTab === "active" &&
            renderEventList(
              events?.activeEvents || [],
              "Tidak ada event aktif saat ini.",
              "active"
            )}{" "}
          {activeTab === "draft" &&
            renderEventList(
              events?.draftEvents || [],
              "Tidak ada event dalam status draft.",
              "draft"
            )}{" "}
          {activeTab === "past" &&
            renderEventList(
              events?.pastEvents || [],
              "Tidak ada event yang sudah selesai.",
              "past"
            )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default EventsPage;
