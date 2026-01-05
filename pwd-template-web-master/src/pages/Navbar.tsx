"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import LogoutButton from "@/components/LogoutButton";
import LandingPageJonathan from "./landingPageJonathan";
import { FaCompass } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa6";
import { FaTicketAlt } from "react-icons/fa";

import PaymentStatusAlert from "@/components/PaymentStatusAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [roles, setRoles] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const picRef = useRef<HTMLImageElement>(null);
  const [activeRole, setActiveRole] = useState("CUSTOMER");

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

  useEffect(() => {
    if (user?.roles) {
      setRoles(user.roles);

      setActiveRole(
        user.roles.includes("CUSTOMER") ? "CUSTOMER" : user.roles[0]
      );
    }
  }, [user]);

  useEffect(() => {
    if (roles.includes("ORGANIZER")) {
      setActiveRole("ORGANIZER");
    } else {
      setActiveRole("CUSTOMER");
    }
  }, [roles]);

  const toggleRole = () => {
    setActiveRole((prev) => (prev === "CUSTOMER" ? "ORGANIZER" : "CUSTOMER"));
  };
  return (
    <div id="landing-page" className="bg-white min-h-screen">
      <PaymentStatusAlert />
      <ToastContainer position="top-right" autoClose={5000} />
      <section
        id="navbar"
        className="bg-blue-900 h-20 flex items-center justify-between "
      >
        <div className="flex items-center ">
          <Link href="#">
            <img
              id="logo"
              alt="Logo EventUp"
              src="img/logo/logo_EventUp.png"
              className="h-40 "
            />
          </Link>
        </div>

        <nav
          id="nav-list"
          className="-translate-x-10 flex items-center justify-between gap-5"
        >
          {!user && (
            <>
              <ul className="text-white flex gap-5">
                <Link
                  href="/jelajah-event"
                  className="flex items-center gap-1.5"
                >
                  <FaCompass className="" />
                  Jelajah event
                </Link>
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
              </ul>
            </>
          )}

          {user && (
            <>
              <ul id="nav-list-ul" className="flex gap-10 text-gray-200">
                <li className="flex gap-5">
                  {/* Role CUSTOMER */}

                  {activeRole === "ORGANIZER" ? (
                    <>
                      {/* Role ORGANIZER */}

                      <Link
                        href="/create-event"
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <FaCalendarPlus className="text-[1rem]" />
                        Buat Event
                      </Link>

                      <Link
                        href="/jelajah-event"
                        className="flex items-center gap-1.5"
                      >
                        <FaCompass className="text-[1rem]" />
                        Jelajah event
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* <Link
                        href="#"
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <RiDiscountPercentFill className="text-[1rem]" />
                        Promo
                      </Link> */}

                      <Link
                        href="/tiket-saya"
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <FaTicketAlt className="text-[1rem]" />
                        Tiket Saya
                      </Link>

                      <Link
                        href="/jelajah-event"
                        className="flex items-center gap-1.5"
                      >
                        <FaCompass className="text-[1rem]" />
                        Jelajah event
                      </Link>
                    </>
                  )}
                </li>
              </ul>
            </>
          )}

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
              className={`absolute h-[28rem] mt-[125%]  w-xs overflow-hidden transition-all duration-500 text-gray-100 ${
                open ? "translate-y-0 opacity-100" : "-translate-y-0 opacity-0"
              } `}
            >
              <div id="sub-menu" className="bg-gray-500 p-5 m-2.5 ">
                <div id="user-info" className="">
                  <div className="flex items-center gap-2">
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
                        className="font-light text-xs capitalize cursor-pointer"
                        onClick={toggleRole}
                      >
                        {activeRole}
                      </h3>
                    </div>
                  </div>
                  <h4 id="code-referral" className="font-light text-xs">
                    Kode Referral : {user.referralCode}
                  </h4>
                </div>

                <hr className="border-0 h-[0.5px] w-full bg-[#ccc] mt-4 mb-2.5" />

                {/* Role Organizer */}

                {activeRole === "ORGANIZER" ? (
                  <>
                    <div id="role-organizer">
                      <Link
                        href="/member"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold ">Dashboard</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>

                      <Link
                        href="/member/events"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold ">Event Saya</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>

                      <hr className="border-0 h-[0.5px] w-full bg-[#ccc] mt-4 mb-2.5" />

                      <Link
                        href="/member/profile"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold ">Profile</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>
                      <Link
                        href="#"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold">
                          Informasi Legal
                        </p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>
                      <Link
                        href="#"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full  hover:font-bold">Rekening</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>
                      <Link
                        href="#"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full  hover:font-bold">Pengaturan</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Role CUSTOMER */}
                    <div id="role-customer">
                      <Link
                        href="/jelajah-event"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold ">Jelajah Event</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>

                      <Link
                        href="/tiket-saya"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold ">Tiket Saya</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>

                      <Link
                        href="/transaksi-saya"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold ">
                          Transaksi Saya
                        </p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>

                      <Link
                        href="#"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold ">Promo</p>
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
                        <p className="w-full hover:font-bold ">Profile</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>
                      <Link
                        href="#"
                        id="sub-menu-link"
                        className="group flex items-center text-d no-underline mt-3"
                      >
                        <p className="w-full hover:font-bold">Pengaturan</p>
                        <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                          &gt;
                        </span>
                      </Link>
                    </div>
                  </>
                )}

                <hr className="border-0 h-[0.5px] w-full bg-[#ccc] mt-4 mb-2.5" />
                <LogoutButton />
              </div>
            </div>
          )}
        </nav>
      </section>
      <LandingPageJonathan />
    </div>
  );
};

export default Navbar;
