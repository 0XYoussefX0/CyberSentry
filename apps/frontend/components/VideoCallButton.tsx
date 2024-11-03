"use client";

import { useRouter } from "next/navigation";

import videocallIcon from "@/assets/videocallIcon.svg";

function VideoCallButton({ roomID }: { roomID: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/call?roomID=${roomID}&video=true`)}
      aria-label="video call"
      className="rounded-br-lg rounded-tr-lg border-b border-r border-t border-solid border-gray-300 bg-white px-3 py-2.5"
    >
      <img src={videocallIcon.src} alt="" />
    </button>
  );
}

export default VideoCallButton;
