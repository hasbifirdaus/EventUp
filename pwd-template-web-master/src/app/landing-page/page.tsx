import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function landingPage() {
  return (
    <div id="landing-page" className="bg-white pt-5 pb-10 min-h-screen">
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

        <nav id="nav-list" className="-translate-x-10">
          <ul id="nav-list-ul" className="flex gap-10">
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
              <Link href="#" className="">
                Login
              </Link>
            </li>
            <li>
              <Link href="#" className="">
                Buat Akun
              </Link>
            </li>
          </ul>
        </nav>
      </section>
      <section id="widget"></section>
      <section id="event"></section>
      <section id="promotion"></section>
      <footer></footer>
    </div>
  );
}
