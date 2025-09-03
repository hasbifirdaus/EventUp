"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LandingPage = () => {
  const [open, setOpen] = useState(false);

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
            className="bg-white w-2xl h-8 text-black border-black border-0 rounded-sm"
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
          </ul>
          <img
            id="user-pic"
            src="/img/logo/logo_EventUp.png"
            alt="user-pic"
            className="w-28 rounded-full mr-4 cursor-pointer"
            onClick={() => setOpen(!open)}
          />

          <div
            id="sub-menu-wrap"
            className={`absolute mt-[75%] ml-[35%] w-xs overflow-hidden transition-[max-height] duration-500 text-gray-100 ${
              open ? " max-h-96" : "max-h-0"
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
                <h2 id="username" className="font-medium">
                  hasbi firdaus
                </h2>
              </div>
              <hr className="border-0 h-0.5 w-full bg-[#ccc] mt-4 mb-2.5" />

              <a
                href="#"
                id="sub-menu-link"
                className="group flex items-center text-d no-underline mt-3"
              >
                <img
                  src="/img/logo/logo_EventUp.png"
                  alt="img-profile"
                  className="w-10 bg-gray-300 p-2 mr-4 rounded-full"
                />
                <p className="w-full hover:font-bold ">Edit Profile</p>
                <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                  &gt;
                </span>
              </a>
              <a
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
              </a>
              <a
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
              </a>
              <a
                href="#"
                id="sub-menu-link"
                className="group flex items-center text-d no-underline mt-3"
              >
                <img
                  src="/img/logo/logo_EventUp.png"
                  alt="log-out"
                  className="w-10 bg-gray-300 p-2 mr-4 rounded-full"
                />
                <p className="w-full  hover:font-bold">Log-out</p>
                <span className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
                  &gt;
                </span>
              </a>
            </div>
          </div>
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
