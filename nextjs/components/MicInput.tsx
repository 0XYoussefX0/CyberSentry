"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

import { toast } from "@/hooks/use-toast";

import micIcon from "@/assets/micIcon.svg";

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
