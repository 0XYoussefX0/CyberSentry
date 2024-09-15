"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";

import { startCounter, stopCounter } from "@/lib/utils";

import CancelIcon from "@/components/CancelIcon";
import MicInput from "@/components/MicInput";

import emojiIcon from "@/assets/emojiIcon.svg";

import AudioVisualizer from "./AudioVisualizer";
import { Button } from "./ui/Button";

function MessageInput() {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messageInputContainer = useRef<HTMLDivElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);

  const handleFocus = () => {
    if (messageInputContainer.current) {
      messageInputContainer.current.classList.add("focus");
    }
  };

  const handleBlur = () => {
    if (messageInputContainer.current) {
      messageInputContainer.current.classList.remove("focus");
    }
  };

  const handleClick = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    if (messageInput.current && e.target === e.currentTarget) {
      messageInput.current.focus();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (messageInput.current) {
      messageInput.current.focus();
      messageInput.current.value += emojiData.emoji;
    }
  };

  const audioRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder>();
  const dataArrayRef = useRef<Uint8Array>();
  const bufferLength = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        mediaRecorderRef.current = new MediaRecorder(stream);

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);

        bufferLength.current = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength.current);

        mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
          audioRef.current.push(e.data);
        });

        mediaRecorderRef.current.addEventListener("stop", (e) => {
          const blob = new Blob(audioRef.current, {
            type: "audio/wav; codecs=opus",
          });

          const file = new File([blob], "audio.wav", {
            type: "audio/wav",
            lastModified: new Date().getTime(),
          });
        });
      } catch (e) {
        alert("Error accessing the microphone");
      }
    })();

    // add clean up function
  }, []);

  const [timer, setTimer] = useState("00:00");

  const counterId = useRef<NodeJS.Timeout>();
  const startRecording = async () => {
    if (!mediaRecorderRef.current) return;
    // check if you already have permission

    audioRef.current = [];
    mediaRecorderRef.current.start();
    counterId.current = startCounter(setTimer);
    setIsRecording(true);
  };

  const cancelRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    stopCounter(counterId.current!);
    setTimer("00:00");
  };

  const sendRecording = () => {};

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-6">
      <div
        style={{
          transform: isRecording ? "translateY(120%)" : "translateY(250%)",
        }}
        className="flex flex-col transition-transform"
      >
        <div className="flex w-full items-center gap-2">
          <div>{timer}</div>
          <div ref={containerRef} className="flex-1">
            <AudioVisualizer
              isRecording={isRecording}
              analyser={analyserRef.current}
              bufferLength={bufferLength.current}
              dataArray={dataArrayRef.current}
              containerWidth={containerRef.current?.clientWidth}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={cancelRecording} aria-label="Cancel recording">
            <CancelIcon />
          </button>
          <Button className="px-3.5 text-sm">Send</Button>
        </div>
      </div>

      <div
        style={{
          transform: isRecording ? "translateY(120%)" : "translateY(0%)",
        }}
        ref={messageInputContainer}
        className="cursor-text rounded-lg outline outline-1 outline-transparent transition-all"
      >
        <textarea
          ref={messageInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Send a message"
          className="w-full resize-none rounded-t-lg border-l border-r border-t border-solid border-gray-300 bg-white px-3.5 py-2.5 font-normal leading-6 placeholder:text-gray-500 focus:border-inherit focus:outline-none focus:ring-0"
        ></textarea>
        <div
          onClick={(e) => handleClick(e)}
          className="relative flex w-full resize-none items-center justify-end gap-4 rounded-b-lg border-b border-l border-r border-solid border-gray-300 bg-white px-3.5 py-2.5"
        >
          <MicInput
            startRecording={startRecording}
            setIsRecording={setIsRecording}
            isRecording={isRecording}
          />
          <button
            className="relative"
            onClick={() => setOpenEmojiPicker((prev) => !prev)}
          >
            <img src={emojiIcon.src} alt="" />
            <div className="absolute bottom-full right-0 mb-2">
              {/* test this component in production and see if it still lagging, if it is then render the component as soon as the page loads, so that the emojis load */}
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                open={openEmojiPicker}
                searchDisabled={true}
                emojiStyle={"facebook" as EmojiStyle}
              />
            </div>
          </button>
          <Button className="px-3.5 text-sm">Send</Button>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
