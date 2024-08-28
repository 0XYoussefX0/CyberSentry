"use client";
import { useState, useEffect } from "react";

import { CaptchaDataType } from "@/lib/types";

import { RecaptchaVerifier } from "firebase/auth";

import { auth } from "@/lib/firebase/config";

export default function useRecaptchaVerifier(containerID: string) {
  const [captchaData, setCaptchaData] = useState<CaptchaDataType>({
    appVerifier: undefined,
    widgetId: undefined,
  });

  useEffect(() => {
    (async () => {
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerID, {});
      const widgetId = await recaptchaVerifier.render();
      setCaptchaData({
        appVerifier: recaptchaVerifier,
        widgetId,
      });
    })();
  }, []);

  return captchaData;
}
