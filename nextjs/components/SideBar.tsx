"use client";

import LogOutButton from "@/components/LogOutButton";
import Logo from "@/components/Logo";
import messagesIcon from "@/assets/messagesIcon.svg";
import homeIcon from "@/assets/homeIcon.svg";
import dashboardIcon from "@/assets/dashboardIcon.svg";
import projectsIcon from "@/assets/projectsIcon.svg";
import tasksIcon from "@/assets/tasksIcon.svg";
import piechartIcon from "@/assets/piechartIcon.svg";
import supportIcon from "@/assets/supportIcon.svg";
import settingsIcon from "@/assets/settingsIcon.svg";

import Link from "next/link";
import { getImageMimeType } from "@/lib/utils";

import { SideBarProps } from "@/lib/types";
import { useState } from "react";
import { createPortal } from "react-dom";

const NavigationLink = ({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: any;
}) => {
  return (
    <li>
      <Link
        className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-gray-100"
        href={href}
      >
        <img src={icon.src} alt="" />
        <div className="font-semibold leading-6 text-gray-700">{label}</div>
      </Link>
    </li>
  );
};

const toplinks = [
  {
    icon: homeIcon,
    label: "Home",
    href: "/",
  },
  {
    icon: dashboardIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: projectsIcon,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: tasksIcon,
    label: "Tasks",
    href: "/tasks",
  },
  {
    icon: piechartIcon,
    label: "Reporting",
    href: "/reporting",
  },
  {
    icon: messagesIcon,
    label: "Messages",
    href: "/messages",
  },
];

const bottomLinks = [
  {
    icon: supportIcon,
    label: "Support",
    href: "/support",
  },
  {
    icon: settingsIcon,
    label: "Settings",
    href: "/settings",
  },
];

export default function SideBar({
  avatar_image,
  username,
  userEmail,
}: SideBarProps) {
  const [openSideBar, setOpenSideBar] = useState(true);

  return (
    <>
      <button
        aria-label={openSideBar ? "Close the sidebar" : "Open the sidebar"}
        onClick={() => setOpenSideBar((prev) => !prev)}
        className="absolute left-0 top-0 z-20 text-black md:hidden"
      >
        {openSideBar ? "Close" : "Open"}
      </button>
      {createPortal(
        <>
          <div
            data-state={openSideBar ? "open" : "closed"}
            className="fixed inset-0 z-10 hidden bg-black/80 fill-mode-forwards data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:block md:hidden"
          ></div>
          <nav
            data-state={openSideBar ? "open" : "closed"}
            className="fixed inset-y-0 left-0 z-10 flex min-h-screen w-screen flex-col justify-between border-r border-solid border-r-gray-200 bg-white px-4 py-8 transition ease-in-out fill-mode-forwards data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-[312px] md:sticky md:w-full"
          >
            <div className="flex flex-col gap-6">
              {/* change the logo to use the font instead of the way you are currently using it and expirement with diffferent font sizes and font weights */}
              {/* <Logo /> */}
              <ul className="flex flex-col gap-0.5">
                {toplinks.map((link) => (
                  <NavigationLink key={link.label} {...link} />
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <ul className="flex flex-col gap-0.5">
                {bottomLinks.map((link) => (
                  <NavigationLink key={link.label} {...link} />
                ))}
              </ul>
              <div className="flex items-center justify-between gap-10 border-t border-solid border-t-gray-200 pt-6">
                <div className="flex flex-1 items-center gap-3">
                  <img
                    src={avatar_image}
                    alt="Your Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <div className="text-sm font-semibold leading-5 text-gray-900">
                      {username}
                    </div>
                    <div className="truncate text-sm font-normal leading-5 text-gray-600">
                      {userEmail}
                    </div>
                  </div>
                </div>
                <LogOutButton />
              </div>
            </div>
          </nav>
        </>,
        document.body,
      )}
    </>
  );
}
