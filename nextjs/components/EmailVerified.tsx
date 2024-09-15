"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";

import verifiedIcon from "@/assets/verifiedIcon.svg";

export default function EmailVerified() {
  const [exit, setExit] = useState(false);
  const router = useRouter();

  return (
    <main className="px-4 pt-12 pb-6 lp:pb-16 flex flex-col gap-[132px] min-h-screen h-full justify-between relative lp:items-center">
      <motion.div
        initial={{ y: 50, scale: 0.8, opacity: 0 }}
        animate={
          exit
            ? { y: -50, scale: 0.8, opacity: 0 }
            : { y: 0, scale: 1, opacity: 1 }
        }
        onAnimationComplete={() => {
          if (exit) {
            router.push("/onboarding");
          }
        }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative lp:max-w-[420px] lp:w-full"
      >
        <div className="mask-2"></div>
        <div className="gridd-2"></div>
        <div className="flex flex-col gap-8 h-[484px]">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white border border-solid border-gray-200 w-14 h-14 flex items-center justify-center rounded-xl shadows">
              <img src={verifiedIcon.src} alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-center leading-8 text-2xl text-gray-900">
                Email verified
              </h1>
              <p className="text-center font-normal leading-6 text-base text-gray-600">
                Your Email has been successfully verified. <br />
                Click below to start the onboarding process.
              </p>
            </div>
          </div>
          <Button onClick={() => setExit(true)}>Start the Onboarding</Button>
        </div>
      </motion.div>
    </main>
  );
}
