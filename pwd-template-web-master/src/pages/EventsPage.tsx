"use client";
import React, { useState } from "react";

// Main component for the "Event Saya" page
const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("active");

  const renderContent = () => {
    switch (activeTab) {
      case "active":
        return (
          <div
            id="active-content"
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Event Aktif
            </h2>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
              <p>
                Tidak ada event aktif saat ini. Anda dapat membuat event baru.
              </p>
            </div>
          </div>
        );
      case "draft":
        return (
          <div id="draft-content" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Event Draft
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
              <p>Anda memiliki 2 event dalam status draft.</p>
              <ul className="list-disc list-inside mt-2">
                <li>Event Sesi Belajar Koding</li>
                <li>Event Webinar WebDev</li>
              </ul>
            </div>
          </div>
        );
      case "past":
        return (
          <div id="past-content" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Event Lalu
            </h2>
            <div className="bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-lg">
              <p>Berikut adalah daftar event yang sudah selesai:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Konferensi Tech Summit 2023</li>
                <li>Workshop Desain UI/UX</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { name: "Event Aktif", id: "active" },
    { name: "Event Draft", id: "draft" },
    { name: "Event Lalu", id: "past" },
  ];

  return (
    <div className="bg-white min-h-screen p-8 font-inter">
      <div className=" mx-auto  ">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 font-medium cursor-pointer transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default EventsPage;
