"use client";

import { ElementType, useEffect, useRef, useState } from "react";

interface HyperTextProps<T extends ElementType> {
  as?: T;
  className?: string;
  initialText: string;
  finalText: string;
  startScramble: boolean;
}

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 10;

// const CHARS = "!@#$%^&*():{};|,.<>/?";
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function HyperText<T extends ElementType = "span">({
  as,
  className,
  initialText,
  finalText,
  startScramble,
}: HyperTextProps<T>) {
  const Tag = as ?? "span";
  const [text, setText] = useState(initialText);
  const intervalRef = useRef<number | null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (startScramble) {
      let pos = 0;

      intervalRef.current = setInterval(() => {
        const scrambled = finalText
          .split("")

          .map((char, index) => {
            if (pos / CYCLES_PER_LETTER > index) {
              return char;
            }

            const randomCharIndex = Math.floor(Math.random() * CHARS.length);
            const randomChar = CHARS[randomCharIndex];

            return randomChar;
          })
          .join("");

        setText(scrambled);
        pos++;

        if (pos >= scrambled.length * CYCLES_PER_LETTER) {
          clearInterval(intervalRef.current || undefined);
        }
      }, SHUFFLE_TIME);

      return;
    }

    clearInterval(intervalRef.current || undefined);
    setText(initialText);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startScramble]);

  return <Tag className={className}>{text}</Tag>;
}
