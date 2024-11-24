"use client";

import { logout } from "@/actions/auth/actions";
import LogoutIcon from "@/app/(app)/_components/icons/LogoutIcon";
import { motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(logout, {
    onSuccess: () => {
      router.push("/login");
    },
  });

  return (
    <motion.button
      layout
      disabled={isExecuting}
      onClick={() => execute()}
      aria-label="Log out"
      initial={{ opacity: 0, y: 12, rotate: "180deg" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.125 }}
      className="group relative h-8 w-4 rotate-180 py-2 text-red-600"
    >
      <motion.div
        aria-hidden={true}
        className=" -rotate-180 group-hover:-translate-x-5 -translate-y-1/2 invisible absolute top-1/2 right-full ml-6 translate-x-0 rounded-md bg-red-100 px-2 py-1 text-red-800 text-sm opacity-20 transition-all group-hover:opacity-100 sm:group-hover:visible"
      >
        Logout
      </motion.div>
      <LogoutIcon />
    </motion.button>
  );
}

export default LogoutButton;
