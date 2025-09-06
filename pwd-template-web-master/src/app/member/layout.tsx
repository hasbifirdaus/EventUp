"use client";

import React from "react";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { FaCalendarPlus } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { FaUser } from "react-icons/fa";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || "/dashboard";
  const user = useAuthStore((state) => state.user);

  //mapping path ke judul
  const pageTitles: Record<string, string> = {
    "/member": "Dashboard",
    "/member/events": "Event Saya",
    "/member/profile": "Profile",
    "/informasiLegal": "Informasi Legal",
    "/rekening": "Rekening",
    "/pengaturan": "Pengaturan",
  };

  const currentTitle = pageTitles[pathname] || "Dashboard";

  return (
    <div
      id="section-member-organizer"
      className="bg-neutral-100 min-h-screen max-w-full mx-auto"
    >
      <section
        id="section-member-organizer"
        className="flex max-w-[90rem] lg:max-w-full"
      >
        <aside
          id="sidebar-member-organizer "
          className="bg-blue-900 min-h-screen flex flex-col w-[14%]"
        >
          <Link href="/" className="bg-blue-950 h-17 w-full flex items-center">
            <img
              id="logo"
              src="img/logo/logo_EventUp.png"
              alt="Logo EventUp"
              className="h-40 "
            />
          </Link>

          <nav
            id="nav-item-section-member-organizer"
            className="text-neutral-100 p-3"
          >
            <h4 className="pt-4 px-4 text-xs font-bold mb-3">Dashboard</h4>
            <Link
              href="/member"
              id="sub-menu-link"
              className={`flex items-center gap-6 p-2 ${
                pathname === "/dashboard" ? "bg-blue-600 font-bold" : ""
              }`}
            >
              <GoHomeFill className="w-6 h-6  " />
              <p className="w-full group-hover:translate-x-1.5">Dashboard</p>
            </Link>
            <Link
              href="/member/events"
              id="sub-menu-link"
              className={`flex items-center gap-6 p-2 transition-transform duration-500 group   ${
                pathname === "/events" ? "bg-blue-600 font-bold" : ""
              }`}
            >
              <GoHomeFill className="w-6 h-6  " />
              <p className="w-full group-hover:translate-x-1.5">Event Saya</p>
            </Link>

            <hr className="border-0 h-[0.5px] w-full bg-[#ccc] mt-4 mb-2.5" />

            <h4 className="pt-4 px-4 text-xs font-bold mb-3">Akun</h4>

            <Link
              href="/member/profile"
              id="sub-menu-link"
              className={`flex items-center gap-6 p-2 transition-transform duration-500 group   ${
                pathname === "/profile" ? "bg-blue-600 font-bold" : ""
              }`}
            >
              <GoHomeFill className="w-6 h-6  " />
              <p className="w-full group-hover:translate-x-1.5">Profile</p>
            </Link>
            <Link
              href="/informasiLegal"
              id="sub-menu-link"
              className={`flex items-center gap-6 p-2 transition-transform duration-500 group   ${
                pathname === "/informasiLegal" ? "bg-blue-600 font-bold" : ""
              }`}
            >
              <GoHomeFill className="w-6 h-6  " />
              <p className="w-full group-hover:translate-x-1.5">
                Informasi Legal
              </p>
            </Link>
            <Link
              href="/rekening"
              id="sub-menu-link"
              className={`flex items-center gap-6 p-2 transition-transform duration-500 group   ${
                pathname === "/rekening" ? "bg-blue-600 font-bold" : ""
              }`}
            >
              <GoHomeFill className="w-6 h-6  " />
              <p className="w-full group-hover:translate-x-1.5">Rekening</p>
            </Link>
            <Link
              href="/pengaturan"
              id="sub-menu-link"
              className={`flex items-center gap-6 p-2 transition-transform duration-500 group   ${
                pathname === "/pengaturan" ? "bg-blue-600 font-bold" : ""
              }`}
            >
              <GoHomeFill className="w-6 h-6  " />
              <p className="w-full group-hover:translate-x-1.5">Pengaturan</p>
            </Link>
          </nav>
        </aside>

        <main id="content-member-organizer" className="w-[86%]">
          <nav
            id="navbar-member-dashboard"
            className="flex justify-between p-6 items-center border-b-2 border-gray-200 bg-white"
          >
            <h4
              id="navbar-member-dashboard-name"
              className="font-semibold text-2xl text-gray-600"
            >
              {currentTitle}
            </h4>
            <div className="flex gap-5 items-center">
              <Link href="/create-event">
                <button className="cursor-pointer border-[1px] border-black rounded-md text-black p-3 font-semibold flex items-center gap-1">
                  <FaCalendarPlus className="" />
                  Buat Event
                </button>
              </Link>
              <h3 className="border border-gray-200 bg-gray-200 rounded-full p-1.5 flex items-center gap-2">
                <FaUser className="min-h-6 min-w-6 p-1 bg-blue-200 rounded-full text-blue-700 text-sm flex-shrink-0" />
                {user?.email}
              </h3>
            </div>
          </nav>
          {children}
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
