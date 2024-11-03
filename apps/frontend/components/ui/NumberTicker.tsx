"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

const formatNumber = (number: number) => {
  return Intl.NumberFormat("en-US").format(Number(number.toFixed(0)));
};

export function NumberTicker({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true });

  const [number, setNumber] = useState("0");

  useEffect(() => {
    isInView && motionValue.set(value);
  }, [isInView]);

  //   useEffect(() => {
  //     if (!isInView) {
  //       motionValue.set(0);
  //     }
  //   }, [isInView]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (latest === value) {
          const start = Date.now();
          let prevDelta = 0;
          setInterval(() => {
            const delta = Date.now() - start;

            setNumber((prev) => {
              let prevNumber = prev.split(",").join("");
              return formatNumber(
                Number(prevNumber) + (delta - prevDelta) / 1000,
              );
            });

            prevDelta = delta;
          }, 1000);
        }

        setNumber(formatNumber(latest));
      }),
    [springValue],
  );

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-[#DF2032] tracking-wider",
        className,
      )}
      ref={ref}
    >
      {number}
    </span>
  );
}
