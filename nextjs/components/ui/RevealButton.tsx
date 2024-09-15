import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";

type RevealButtonProps = {
  revealPassword: boolean;
  setRevealPassword: Dispatch<SetStateAction<boolean>>;
};

function RevealButton({
  revealPassword,
  setRevealPassword,
}: RevealButtonProps) {
  return (
    <button
      type="button"
      className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5"
      aria-label={revealPassword ? "Hide password" : "Show password"}
      aria-live="polite"
      onClick={() => setRevealPassword((prev) => !prev)}
    >
      <motion.svg
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.25456 13.4136C1.12318 13.2056 1.05749 13.1016 1.02072 12.9412C0.993095 12.8206 0.993095 12.6306 1.02072 12.5101C1.05749 12.3496 1.12318 12.2456 1.25456 12.0376C2.34027 10.3185 5.57198 5.97253 10.4969 5.97253C15.4218 5.97253 18.6535 10.3185 19.7393 12.0376C19.8706 12.2456 19.9363 12.3496 19.9731 12.5101C20.0007 12.6306 20.0007 12.8206 19.9731 12.9412C19.9363 13.1016 19.8706 13.2056 19.7393 13.4136C18.6535 15.1328 15.4218 19.4787 10.4969 19.4787C5.57198 19.4787 2.34027 15.1328 1.25456 13.4136Z"
          stroke="black"
          strokeWidth="1.92945"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.4969 15.6198C12.0953 15.6198 13.3911 14.324 13.3911 12.7256C13.3911 11.1272 12.0953 9.83144 10.4969 9.83144C8.8985 9.83144 7.60273 11.1272 7.60273 12.7256C7.60273 14.324 8.8985 15.6198 10.4969 15.6198Z"
          stroke="black"
          strokeWidth="1.92945"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <AnimatePresence>
          {revealPassword && (
            <>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{
                  duration: 0.15,
                  ease: [0.65, 0, 0.35, 1],
                }}
                d="M1.81439 3.9325L8.0974 10.2155L19.1794 21.2975"
                stroke="black"
                strokeWidth="1.92945"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{
                  duration: 0.15,
                  ease: [0.65, 0, 0.35, 1],
                }}
                d="M3.63495 2.31763L9.91796 8.60064L21 19.6827"
                stroke="white"
                strokeWidth="2.97496"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </AnimatePresence>
      </motion.svg>
    </button>
  );
}

export default RevealButton;
