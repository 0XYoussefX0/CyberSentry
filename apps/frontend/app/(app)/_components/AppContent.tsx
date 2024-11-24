"use client";

import Logo from "@/app/(app)/_components/icons/Logo";
import useBreakpoints from "@/app/(app)/_hooks/useBreakpoints";
import { useOpenStore } from "@/lib/store";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const breakpoints = [
  {
    label: "isDesktop",
    mediaQueryValue: "(min-width: 1024px)",
  },
];

function AppContent({ children }: { children: ReactNode }) {
  const open = useOpenStore((state) => state.open);
  const setOpen = useOpenStore((state) => state.setOpen);

  const { isDesktop } = useBreakpoints(breakpoints);

  return (
    <motion.div
      layout
      className="bg-white sm:ml-[87px] lg:m-0"
      style={
        isDesktop
          ? {
              width: open ? "calc(100vw - 296px)" : "100%",
            }
          : undefined
      }
    >
      {children}
      <button type="button" className="ml-20" onClick={setOpen}>
        toggle
      </button>
    </motion.div>
  );
}

export default AppContent;
