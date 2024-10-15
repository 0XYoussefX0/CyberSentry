"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue } from "framer-motion";

const World = dynamic(
  () => import("@/components/ui/Globe").then((m) => m.World),
  {
    ssr: false,
  },
);

export default function Globe() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // instead of having

  const positionZ = useMotionValue(300);
  const rotation = useMotionValue(0);

  return (
    <>
      <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto dark:bg-black bg-white relative w-full">
        <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
          <div
            ref={containerRef}
            className="absolute cursor-grab active:cursor-grabbing w-full -bottom-20 h-72 md:h-full z-10"
          >
            <World
              containerRef={containerRef}
              positionZ={positionZ}
              rotation={rotation}
            />
          </div>
        </div>
      </div>
      <div id="controls">
        <label htmlFor="rotationRange">Rotation</label>
        <input
          onChange={(e) => rotation.set(Number(e.target.value))}
          type="range"
          id="rotationRange"
          min="0"
          max="360"
        />

        <label htmlFor="zoomRange">Zoom</label>
        <input
          onChange={(e) => positionZ.set(Number(e.target.value))}
          type="range"
          id="zoomRange"
          min="300"
          max="12000"
        />
      </div>
    </>
  );
}
