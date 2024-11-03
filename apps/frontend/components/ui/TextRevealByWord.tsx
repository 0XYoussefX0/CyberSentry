"use client";

import { FC, ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

import { NumberTicker } from "./NumberTicker";

interface TextRevealByWordProps {
  text: string;
  className?: string;
  renderNumberTicker?: boolean;
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
  renderNumberTicker,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("h-[200vh]", className)}>
      <div
        className={
          "sticky top-0 left-0 mx-auto flex h-1/2 max-w-4xl items-center bg-transparent px-4 py-5"
        }
      >
        <p
          className={
            "flex flex-wrap text-[46px] font-bold md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl"
          }
        >
          {renderNumberTicker && <NumberTicker value={15743898} />}

          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: any;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className={"absolute opacity-30"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-black dark:text-white"}
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TextRevealByWord;
