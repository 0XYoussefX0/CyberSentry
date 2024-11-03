"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { SideBarProps } from "@/lib/types";
import { getImageMimeType } from "@/lib/utils";

import Logo from "@/components/icons/Logo";
import LogOutButton from "@/components/LogOutButton";

import dashboardIcon from "@/assets/dashboardIcon.svg";
import homeIcon from "@/assets/homeIcon.svg";
import messagesIcon from "@/assets/messagesIcon.svg";
import piechartIcon from "@/assets/piechartIcon.svg";
import projectsIcon from "@/assets/projectsIcon.svg";
import settingsIcon from "@/assets/settingsIcon.svg";
import supportIcon from "@/assets/supportIcon.svg";
import tasksIcon from "@/assets/tasksIcon.svg";

import HamburgerIcon from "./icons/HamburgerIcon";

const NavigationLink = ({
  label,
  href,
  openSideBar,
  icon,
}: {
  label: string;
  href: string;
  openSideBar: boolean;
  icon: any;
}) => {
  return (
    <li
      data-state={openSideBar ? "open" : "closed"}
      className="md:data-[state=closed]:flex md:data-[state=closed]:justify-end"
    >
      <Link
        data-state={openSideBar ? "open" : "closed"}
        className="md:data-[state=open]:justify-start md:data-[state=closed]:justify-end md:data-[state=closed]:w-fit flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-gray-100"
        href={href}
      >
        <img src={icon.src} alt="" />

        <div
          data-state={openSideBar ? "open" : "closed"}
          className="md:data-[state=closed]:hidden font-semibold leading-6 text-gray-700"
        >
          {label}
        </div>
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

  useEffect(() => {
    const body = document.body;

    if (openSideBar) {
      body.classList.add(
        "md:ml-[312px]",
        "overflow-y-hidden",
        "md:overflow-y-auto",
      );
      body.classList.remove("md:ml-[80px]");
    } else {
      body.classList.add("md:ml-[80px]");
      body.classList.remove(
        "md:ml-[312px]",
        "overflow-y-hidden",
        "md:overflow-y-auto",
      );
    }

    body.style.transitionDuration = openSideBar ? "0.5s" : "0.3s";
  }, [openSideBar]);

  return (
    <>
      <div className="bg-white p-4 md:hidden relative w-full border-b border-solid border-b-gray-200">
        <button
          aria-label={openSideBar ? "Close the sidebar" : "Open the sidebar"}
          onClick={() => setOpenSideBar((prev) => !prev)}
          className="absolute left-4 top-[26px] z-50 "
        >
          <HamburgerIcon open={openSideBar} />
        </button>
        <div className="bg-transparent h-8"></div>
        {/* <Logo /> */}
      </div>

      <div
        data-state={openSideBar ? "open" : "closed"}
        className="fixed inset-0 z-40 hidden bg-black/80 fill-mode-forwards data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:block md:hidden"
      ></div>
      <nav
        data-state={openSideBar ? "open" : "closed"}
        className="fixed sidebar  pt-14 inset-y-0 left-0 z-40 flex min-h-screen w-screen flex-col justify-between border-r border-solid border-r-gray-200 bg-white px-4 py-8 md:pt-8 transition ease-in-out fill-mode-forwards data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left md:data-[state=closed]:slide-out-to-left-[74.5%] md:data-[state=open]:slide-in-from-left-[74.5%] sm:max-w-[312px] md:w-full"
      >
        <div className="flex flex-col gap-6">
          {/* change the logo to use the font instead of the way you are currently using it and expirement with diffferent font sizes and font weights */}
          {/* <Logo /> */}
          <button
            className="hidden md:block"
            onClick={() => setOpenSideBar((prev) => !prev)}
          >
            Logo
          </button>
          <ul className="flex flex-col gap-0.5">
            {toplinks.map((link) => (
              <NavigationLink
                openSideBar={openSideBar}
                key={link.label}
                {...link}
              />
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6 items-end">
          <ul className="flex flex-col gap-0.5 w-full">
            {bottomLinks.map((link) => (
              <NavigationLink
                openSideBar={openSideBar}
                key={link.label}
                {...link}
              />
            ))}
          </ul>
          <div
            data-state={openSideBar ? "open" : "closed"}
            className="flex w-full md:data-[state=closed]:hidden items-center justify-between gap-10 border-t border-solid border-t-gray-200 pt-6"
          >
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
          <div
            data-state={openSideBar ? "open" : "closed"}
            className="hidden px-1 md:data-[state=closed]:flex items-center justify-end gap-10 border-t border-solid border-t-gray-200 pt-6"
          >
            <img
              src={avatar_image}
              alt="Your Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>
      </nav>
    </>
  );
}
