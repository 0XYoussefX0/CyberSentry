"use client";

import { useRef, MouseEvent, useState, useEffect } from "react";

import emojiIcon from "@/assets/emojiIcon.svg";

import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";

import MicInput from "@/components/MicInput";

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

  const startRecording = async () => {
    if (!mediaRecorderRef.current) return;
    // check if you already have permission
    try {
    } catch (e) {}
    audioRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const cancelRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const sendRecording = () => {};

  const timer = "00:00";

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
          <Button className="px-3">send</Button>
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
          <button onClick={() => setOpenEmojiPicker((prev) => !prev)}>
            <img src={emojiIcon.src} alt="" />
            <div className="absolute bottom-10 right-[66px]">
              {/* test this component in production and see if it still lagging, if it is then render the component as soon as the page loads, so that the emojis load */}
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                open={openEmojiPicker}
                searchDisabled={true}
                emojiStyle={"facebook" as EmojiStyle}
              />
            </div>
          </button>
          <button>send</button>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;

const CancelIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group"
    >
      <path
        d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6"
        className="stroke-black transition-colors group-hover:stroke-red-500"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
