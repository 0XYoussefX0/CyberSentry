"use client";

import { motion } from "framer-motion";

import Logo from "@/app/(app)/_components/icons/Logo";
import type { SideBarTopProps } from "@pentest-app/types/client";

function SideBarTop({ open, setOpen }: SideBarTopProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={setOpen}
      layout
      className="flex h-10 justify-start"
    >
      <motion.div
        className="h-10"
        layout="position"
        style={{
          width: open ? "128px" : "46px",
        }}
      >
        <Logo shrink={!open} />
      </motion.div>
    </motion.button>
  );
}

export default SideBarTop;
