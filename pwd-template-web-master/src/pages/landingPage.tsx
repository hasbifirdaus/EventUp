"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import LogoutButton from "@/components/LogoutButton";

const LandingPage = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const menuRef = useRef<HTMLDivElement>(null);
  const picRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        picRef.current &&
        !picRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="landing-page" className="bg-white min-h-screen">
      <section
        id="navbar"
        className="bg-blue-900 h-20 flex items-center justify-between "
      >
        <div className="flex items-center gap-0.5">
          <a href="#">
            <img
              id="logo"
              alt="Logo EventUp"
              src="img/logo/logo_EventUp.png"
              className="h-40 "
            />
          </a>
          <input
            placeholder="Cari event seru disini"
            className="bg-white w-2xl h-8 text-black border-black border-0 rounded-sm p-2"
          ></input>
        </div>

        <nav
          id="nav-list"
          className="-translate-x-10 flex items-center justify-between gap-5"
        >
          <ul id="nav-list-ul" className="flex gap-10 text-gray-200">
            <li>
              <Link href="#" className="">
                Jelajah event
              </Link>
            </li>

            {!user && (
              <>
                <li>
                  <Link href="#" className="">
                    Tiket Saya
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="">
                    Buat Akun
                  </Link>
                </li>
              </>
            )}
          </ul>

          {user && (
            <img
              ref={picRef}
              id="user-pic"
              src="/img/logo/logo_EventUp.png"
              alt="user-pic"
              className="w-28 rounded-full mr-4 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}

          {user && (
            <div
              ref={menuRef}
              id="sub-menu-wrap"
              className={`absolute mt-[200%] -ml-[48%] w-xs overflow-hidden transition-all duration-500 text-gray-100 ${
                open ? "translate-y-0 opacity-100" : "-translate-y-0 opacity-0"
              } `}
            >
              <div id="sub-menu" className="bg-gray-500 p-5 m-2.5">
                <div id="user-info" className="flex items-center">
                  <img
                    id="img-user"
                    className="w-14 rounded-full mr-4"
                    src="/img/logo/logo_EventUp.png"
                    alt="img-user"
                  />
                  <div className="flex flex-col gap-1">
                    <h2 id="username" className="font-bold capitalize">
                      {user.username}
                    </h2>
                    <h3
                      id="user-role"
                      className="font-light text-xs capitalize"
                    >
                      {user.role}
                    </h3>
                  </div>
                </div>

                <hr className="border-0 h-[0.5px] w-full bg-[#ccc] mt-4 mb-2.5" />
                <Link
                  href="/dashboard/organizer"
                  id="sub-menu-link"
                  className="group flex items-center text-d no-underline mt-3"
                >
                  <img
                    src="/img/logo/logo_EventUp.png"
                    alt="img-dashboard"
                    className="w-10 bg-gray-300 p-2 mr-4 rounded-full"
                  />
                  <p className="w-full hover:font-bold ">Dashboard</p>
                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                    &gt;
                  </span>
                </Link>

                <Link
                  href="#"
                  id="sub-menu-link"
                  className="group flex items-center text-d no-underline mt-3"
                >
                  <img
                    src="/img/logo/logo_EventUp.png"
                    alt="img-event-saya"
                    className="w-10 bg-gray-300 p-2 mr-4 rounded-full"
                  />
                  <p className="w-full hover:font-bold ">Event Saya</p>
                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                    &gt;
                  </span>
                </Link>

                <hr className="border-0 h-[0.5px] w-full bg-[#ccc] mt-4 mb-2.5" />

                <Link
                  href="#"
                  id="sub-menu-link"
                  className="group flex items-center text-d no-underline mt-3"
                >
                  <img
                    src="/img/logo/logo_EventUp.png"
                    alt="img-edit-profile"
                    className="w-10 bg-gray-300 p-2 mr-4 rounded-full"
                  />
                  <p className="w-full hover:font-bold ">Edit Profile</p>
                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                    &gt;
                  </span>
                </Link>
                <Link
                  href="#"
                  id="sub-menu-link"
                  className="group flex items-center text-d no-underline mt-3"
                >
                  <img
                    src="/img/logo/logo_EventUp.png"
                    alt="settings-and-privicy"
                    className="w-10 bg-gray-300 p-2 mr-4 rounded-full"
                  />
                  <p className="w-full hover:font-bold">Settings & privacy</p>
                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                    &gt;
                  </span>
                </Link>
                <Link
                  href="#"
                  id="sub-menu-link"
                  className="group flex items-center text-d no-underline mt-3"
                >
                  <img
                    src="/img/logo/logo_EventUp.png"
                    alt="help-and-support"
                    className="w-10 bg-gray-300 p-2 mr-4 rounded-full"
                  />
                  <p className="w-full  hover:font-bold">Help & Support</p>
                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                    &gt;
                  </span>
                </Link>

                <hr className="border-0 h-[0.5px] w-full bg-[#ccc] mt-4 mb-2.5" />
                <LogoutButton />
              </div>
            </div>
          )}
        </nav>
      </section>
      <section id="widget"></section>
      <section id="event"></section>
      <section id="promotion"></section>
      <footer></footer>
    </div>
  );
};

export default LandingPage;
