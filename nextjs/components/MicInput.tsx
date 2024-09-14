"use client";

import micIcon from "@/assets/micIcon.svg";
import { toast } from "@/hooks/use-toast";

import { useState, useRef, Dispatch, SetStateAction } from "react";
import WaveSurfer from "wavesurfer.js";

function MicInput({
  isRecording,
  setIsRecording,
  startRecording,
}: {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  startRecording: () => void;
}) {
  return (
    <button onClick={startRecording} aria-label="Record a voice message">
      <img src={micIcon.src} alt="" />
    </button>
  );
}

export default MicInput;
