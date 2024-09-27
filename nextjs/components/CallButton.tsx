"use client";

import { useRouter } from "next/navigation";

import callIcon from "@/assets/callIcon.svg";

function CallButton({ roomID }: { roomID: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/call?roomID=${roomID}`)}
      aria-label="call"
      className="rounded-bl-lg rounded-tl-lg border-b border-l border-t border-solid border-gray-300 bg-white px-3 py-2.5"
    >
      <img src={callIcon.src} alt="" />
    </button>
  );
}

export default CallButton;
