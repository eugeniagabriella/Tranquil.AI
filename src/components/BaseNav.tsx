"use client";
// import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "~/components/Logo";
import NavProfile from "~/components/NavProfile";

const NAV_ITEMS = [
  {
    name: "Home",
    href: "/a/home",
  },
  {
    name: "Conversations",
    href: "/a/conversations",
  },
  // {
  //   name: "Analytics",
  //   href: "/a/analytics",
  // },
];

const BaseNav = () => {
  // const user = currentUser();
  const path = usePathname();
  // console.log(path);
  return (
    <nav className="border-b-2 border-black">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-2 py-6">
        <Logo />
        <div className="flex items-center gap-14">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${item.href == path ? "font-medium text-indigo-600 underline" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {/* <div>Profil - {}</div> */}
        <NavProfile />
      </div>
    </nav>
  );
};

export default BaseNav;
