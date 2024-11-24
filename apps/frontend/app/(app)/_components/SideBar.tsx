"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import type { SideBarProps } from "@pentest-app/types/client";

import BugIcon from "@/app/(app)/_components/icons/BugIcon";
import CompassIcon from "@/app/(app)/_components/icons/CompassIcon";
import DashboardIcon from "@/app/(app)/_components/icons/DashboardIcon";
import HandlersIcon from "@/app/(app)/_components/icons/HandlersIcon";
import PlugIcon from "@/app/(app)/_components/icons/PlugIcon";
import ReportsIcon from "@/app/(app)/_components/icons/ReportsIcon";
import RobotIcon from "@/app/(app)/_components/icons/RobotIcon";
import ScansIcon from "@/app/(app)/_components/icons/ScansIcon";
import SettingsIcon from "@/app/(app)/_components/icons/SettingsIcon";
import TargertsIcon from "@/app/(app)/_components/icons/TargertsIcon";
import TeamIcon from "@/app/(app)/_components/icons/TeamIcon";

import LogoutButton from "@/app/(app)/_components/LogoutButton";
import SideBarNavLink from "@/app/(app)/_components/SideBarNavLink";
import SideBarTop from "@/app/(app)/_components/SideBarTop";
import useBreakpoints from "@/app/(app)/_hooks/useBreakpoints";
import { useOpenStore } from "@/lib/store";

const toplinks = [
  {
    icon: DashboardIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: TargertsIcon,
    label: "Targets",
    href: "/targets",
  },
  {
    icon: ScansIcon,
    label: "Scans",
    href: "/scans",
  },
  {
    icon: BugIcon,
    label: "Findings",
    href: "/findings",
  },
  {
    icon: CompassIcon,
    label: "Attack Surface",
    href: "/attackSurface",
  },
  {
    icon: HandlersIcon,
    label: "Handlers",
    href: "/handlers",
  },
];

const bottomLinks = [
  {
    icon: ReportsIcon,
    label: "Reports",
    href: "/reports",
  },
  {
    icon: RobotIcon,
    label: "Automation",
    href: "/automation",
  },
  {
    icon: TeamIcon,
    label: "Team",
    href: "/team",
  },
  {
    icon: PlugIcon,
    label: "Integrations",
    href: "/integrations",
  },
  {
    icon: SettingsIcon,
    label: "Settings",
    href: "/settings",
  },
];

const breakpoints = [
  {
    label: "isMobile",
    mediaQueryValue: "(max-width: 640px)",
  },
  {
    label: "isDesktop",
    mediaQueryValue: "(min-width: 1024px)",
  },
];

export default function Sidebar({
  userImage,
  userName,
  userEmail,
}: SideBarProps) {
  const [selected, setSelected] = useState("Dashboard");

  const open = useOpenStore((state) => state.open);
  const setOpen = useOpenStore((state) => state.setOpen);

  const { isDesktop, isMobile } = useBreakpoints(breakpoints);

  const isTablet = !isDesktop && !isMobile;

  const navState = {
    hidden: {
      x: "-100%",
    },
    visible: {
      x: 0,
    },
  };

  return (
    <motion.nav
      layout
      key={
        isDesktop
          ? "isDesktop"
          : isTablet
            ? "isTablet"
            : isMobile
              ? "isMobile"
              : undefined
      }
      initial={isMobile ? "hidden" : undefined}
      animate={isMobile ? (open ? "visible" : "hidden") : undefined}
      transition={{
        damping: 0,
      }}
      variants={isMobile ? navState : undefined}
      className="absolute top-0 left-0 z-20 flex h-screen shrink-0 flex-col justify-between border-slate-300 border-r bg-white px-5 py-6 lg:sticky"
      style={
        isMobile
          ? { width: "100vw" }
          : isTablet || isDesktop
            ? {
                width: open ? "296px" : "fit-content",
              }
            : undefined
      }
    >
      <div className="flex flex-col gap-8">
        <SideBarTop open={open} setOpen={setOpen} />

        <div className="flex flex-col gap-5">
          <div className="space-y-1">
            {open && (
              <motion.p
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="font-bold text-gray-500 text-xs leading-[18px]"
              >
                Workspaces
              </motion.p>
            )}
            {toplinks.map(({ icon, label, href }) => {
              return (
                <SideBarNavLink
                  key={label}
                  Icon={icon}
                  title={label}
                  selected={selected}
                  setSelected={setSelected}
                  open={open}
                />
              );
            })}
          </div>

          <div className="space-y-1">
            {open && (
              <motion.p
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="font-bold text-gray-500 text-xs leading-[18px]"
              >
                Configurations
              </motion.p>
            )}

            {bottomLinks.map(({ icon, label, href }) => {
              return (
                <SideBarNavLink
                  key={label}
                  Icon={icon}
                  title={label}
                  selected={selected}
                  setSelected={setSelected}
                  open={open}
                />
              );
            })}
          </div>
        </div>
      </div>

      <motion.div
        style={{
          paddingLeft: open ? 12 : 0,
          paddingRight: open ? 12 : 0,
          borderWidth: open ? 1 : 0,
        }}
        className="flex w-full gap-2 rounded-xl border border-gray-300 border-solid py-3"
      >
        {/* <img src={user_image} alt="" className="h-10 w-10 rounded-full" /> */}
        <motion.div
          layout
          style={{
            aspectRatio: "1/1",
            width: open ? 40 : 46,
          }}
          className="rounded-full bg-black"
        />
        {open && (
          <div className="flex flex-1 items-center justify-between gap-1 overflow-hidden">
            <div>
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="text-left font-semibold text-black text-sm"
              >
                Olivia Rhye
              </motion.div>
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="text-left text-gray-600 text-sm"
              >
                olivia@untitledui.com
              </motion.div>
            </div>
            <LogoutButton />
          </div>
        )}
      </motion.div>
    </motion.nav>
  );
}
