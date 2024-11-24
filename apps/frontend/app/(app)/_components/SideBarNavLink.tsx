"use client";

import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";

type SideBarNavLinkProps = {
  Icon: () => JSX.Element;
  title: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  open: boolean;
  notifs?: number;
};

function SideBarNavLink({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
}: SideBarNavLinkProps) {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`group relative flex h-10 w-full items-center gap-2.5 rounded-md p-3 transition-colors ${selected === title ? " text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`}
    >
      <motion.div layout className="h-[22px] w-[22px] text-lg">
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="font-semibold text-base text-blue-950"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 right-2 size-4 rounded bg-indigo-500 text-white text-xs"
        >
          {notifs}
        </motion.span>
      )}

      {selected === title && (
        <motion.div
          layoutId="highlighter"
          className="-z-10 absolute top-0 left-0 h-full w-full rounded-md bg-indigo-100"
        />
      )}

      {!open && (
        <motion.div className="-translate-y-1/2 invisible absolute top-1/2 left-full ml-6 w-fit translate-x-0 whitespace-nowrap rounded-md bg-indigo-100 px-2 py-1 text-indigo-800 text-sm opacity-20 transition-all group-hover:translate-x-2 group-hover:opacity-100 sm:group-hover:visible">
          {title}
        </motion.div>
      )}
    </motion.button>
  );
}

export default SideBarNavLink;
