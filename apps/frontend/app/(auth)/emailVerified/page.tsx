"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";

import verifiedIcon from "@/assets/verifiedIcon.svg";

export default function Page() {
  const [exit, setExit] = useState(false);
  const router = useRouter();

  return (
    <main className="relative flex h-full min-h-screen flex-col lp:items-center justify-between gap-[132px] px-4 pt-12 lp:pb-16 pb-6">
      <motion.div
        initial={{ y: 50, scale: 0.8, opacity: 0 }}
        animate={
          exit
            ? { y: -50, scale: 0.8, opacity: 0 }
            : { y: 0, scale: 1, opacity: 1 }
        }
        onAnimationComplete={() => {
          if (exit) {
            router.push("/dashboard");
          }
        }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative lp:w-full lp:max-w-[420px]"
      >
        <div className="mask-2" />
        <div className="gridd-2" />
        <div className="flex h-[484px] flex-col gap-8">
          <div className="flex flex-col items-center gap-6">
            <div className="shadows flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 border-solid bg-white">
              <img src={verifiedIcon.src} alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-center font-semibold text-2xl text-gray-900 leading-8">
                Email verified
              </h1>
              <p className="text-center font-normal text-base text-gray-600 leading-6">
                Your Email has been successfully verified. <br />
                Click below to go to the dashboard.
              </p>
            </div>
          </div>
          <Button onClick={() => setExit(true)}>Go to The Dashboard</Button>
        </div>
      </motion.div>
    </main>
  );
}
