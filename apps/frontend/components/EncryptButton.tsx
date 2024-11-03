"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { HyperText } from "./ui/HyperText";

const EncryptButton = () => {
  const [startScramble, setStartScramble] = useState(false);

  const randomNumber = Math.floor(Math.random() * 100);

  const initialText = "Scan Your System Now";
  const finalText = `${randomNumber} Vulnerabilities Detected`;

  return (
    <button
      onMouseEnter={() => setStartScramble(true)}
      onMouseLeave={() => setStartScramble(false)}
      className={`group text-white hover:text-[#FF5A5F] active:scale-[97.5%] truncate transition-all relative bg-[#1B2947] py-2.5  font-medium rounded-lg text-base max-w-[320px] w-full overflow-hidden border-[1px] border-[#1B2947] border-opacity-60 px-4 `}
    >
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-6 h-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:stroke-[#FF5A5F] stroke-white transition-colors"
              d="M7 10V8C7 5.23858 9.23858 3 12 3C14.0503 3 15.8124 4.2341 16.584 6M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <HyperText
          initialText={initialText}
          startScramble={startScramble}
          finalText={finalText}
        />
      </div>
      <motion.span
        initial={{
          y: "100%",
        }}
        animate={{
          y: "-100%",
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-[#FF5A5F]/0 from-40% via-[#FF5A5F]/100 to-[#FF5A5F]/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </button>
  );
};

export default EncryptButton;
