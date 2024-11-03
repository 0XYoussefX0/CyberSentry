"use client";

import { useEffect, useState } from "react";
import { RecaptchaVerifier } from "firebase/auth";

import { auth } from "@/lib/firebase/config";
import { CaptchaDataType } from "@/lib/types";

export default function useRecaptchaVerifier(containerID: string) {
  const [captchaData, setCaptchaData] = useState<CaptchaDataType>({
    appVerifier: undefined,
    widgetId: undefined,
  });

  useEffect(() => {
    (async () => {
      if (!captchaData.appVerifier) {
        const recaptchaVerifier = new RecaptchaVerifier(auth, containerID, {});
        const widgetId = await recaptchaVerifier.render();
        setCaptchaData({
          appVerifier: recaptchaVerifier,
          widgetId,
        });
      }
    })();
  }, []);

  return captchaData;
}
