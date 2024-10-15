"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface BlurIntProps {
  startScramble: boolean;
  word: string;
  className?: string;
  variant?: {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  };
  duration?: number;
}
const BlurIn = ({
  startScramble,
  word,
  className,
  variant,
  duration = 1,
}: BlurIntProps) => {
  const defaultVariants = {
    hidden: { filter: "blur(5px)", opacity: 1 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (startScramble) {
      setVisible(true);
      return;
    }

    setVisible(false);
  }, [startScramble]);

  return (
    <motion.h1
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      transition={{ duration }}
      variants={combinedVariants}
      className={cn("drop-shadow-sm", className)}
    >
      {word}
    </motion.h1>
  );
};

export default BlurIn;
