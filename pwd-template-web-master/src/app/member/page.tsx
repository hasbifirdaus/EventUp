import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div id="section-member-organizer" className="bg-neutral-100 min-h-screen">
      <section id="section-member-organizer">
        <div
          id="sidebar-member-organizer "
          className="bg-blue-900 min-h-screen max-w-2xs flex flex-col items-center"
        >
          <Link
            href="#"
            className="bg-blue-950 h-17 w-full flex flex-col items-center"
          >
            <img
              id="logo"
              src="img/logo/logo_EventUp.png"
              alt="Logo EventUp"
              className="h-40 -mt-11 "
            />
          </Link>

          <nav
            id="nav-item-section-member-organizer"
            className="text-neutral-100"
          >
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
          </nav>
        </div>

        <div id="content-member-organizer"></div>
      </section>
    </div>
  );
};

export default page;
