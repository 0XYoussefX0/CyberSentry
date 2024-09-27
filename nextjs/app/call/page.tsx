"use client";

import { useEffect, useState } from "react";

import { checkCameraAvailability } from "@/lib/utils";

import cameraIcon from "@/assets/cameraIcon.svg";
import chatIcon from "@/assets/chatIcon.svg";
import flipCameraIcon from "@/assets/flipCameraIcon.svg";
import micIcon from "@/assets/micIcon_2.svg";
import quitIcon from "@/assets/quitIcon.svg";
import shareIcon from "@/assets/shareIcon.svg";
import soundIcon from "@/assets/soundIcon.svg";
import user from "@/assets/user.png";

export default function Page() {
  const [hasFrontCamera, setHasFrontCamera] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const result = await checkCameraAvailability();
      if (!result) return;

      const { hasFrontCamera } = result;
      setHasFrontCamera(true);
    })();
  }, []);

  const roomIsMuted = true;
  const micIsOn = true;
  const cameraIsOn = true;

  return (
    <div className="min-h-screen bg-black justify-between flex flex-col">
      <div className="flex justify-between items-center px-4 py-5">
        <img alt="logo" />
        <div className="flex gap-4">
          {hasFrontCamera && (
            <button
              aria-label="flip camera"
              className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
            >
              <img src={flipCameraIcon.src} alt="" />
            </button>
          )}
          <button
            aria-label={roomIsMuted ? "unmute the room" : "mute the room"}
            className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
          >
            <img src={soundIcon.src} alt="" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2  py-2">
        {Array.from({ length: 3 }).map(() => (
          <div className="flex relative aspect-video bg-[#0B0E15] rounded-2xl items-center justify-center">
            <img
              src={user.src}
              alt=""
              className="w-[70px] aspect-square rounded-full"
            />
            <div className="text-white text-sm tracking-[0.25px] absolute bottom-2 left-2 bg-black bg-opacity-65 flex  py-1 px-2 rounded-lg">
              Mathew
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-center px-4 pt-4 pb-8">
        <button
          aria-label="Quit The Room"
          className="border border-solid rounded-lg border-[#C74E5B] bg-[#C74E5B] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={quitIcon.src} alt="" />
        </button>
        <button
          aria-label={micIsOn ? "Turn off the mic" : "Turn on the mic"}
          className={`border border-solid rounded-lg border-[#272A31] bg-[${micIsOn ? "#272A31" : "black"}] flex justify-center items-center w-10 h-10 disabled:opacity-70`}
        >
          <img src={micIcon.src} alt="" />
        </button>
        <button
          aria-label={cameraIsOn ? "Turn off the camera" : "turn on the camera"}
          className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={cameraIcon.src} alt="" />
        </button>
        <button
          aria-label="open chat drawer"
          className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={chatIcon.src} alt="" />
        </button>
        <button
          aria-label="share "
          className="border border-solid rounded-lg border-[#272A31] flex justify-center items-center w-10 h-10 disabled:opacity-70"
        >
          <img src={shareIcon.src} alt="" />
        </button>
      </div>
    </div>
  );
}
