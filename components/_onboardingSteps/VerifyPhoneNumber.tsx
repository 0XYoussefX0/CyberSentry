"use client";

import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

import { useState, useRef, useEffect } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/OTPInput";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { OTPSchema, OTPSchemaType, CaptchaDataType } from "@/lib/types";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase/config";

import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  deleteUser,
} from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/client";

export default function VerifyPhoneNumber({ goback }: { goback: () => void }) {
  const [sentOTP, setSentOTP] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const phoneNumber = localStorage.getItem("phoneNumber") as string;

  const [loading, setLoading] = useState(false);

  const [attemptsNumber, setAttemptsNumber] = useState(1);

  const router = useRouter();

  const [captchaData, setCaptchaData] = useState<CaptchaDataType>({
    appVerifier: undefined,
    widgetId: undefined,
  });

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult>();

  const [error, setError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OTPSchemaType>({
    resolver: valibotResolver(OTPSchema),
  });

  const sendOTP = async () => {
    const { appVerifier, widgetId } = captchaData;
    if (!appVerifier) {
      setError("You have to solve the Captcha First");
      return;
    }
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setConfirmationResult(confirmationResult);
      setSentOTP(true);
    } catch (error: any) {
      console.log(error);
      setAttemptsNumber((prev) => prev + 1);
      // @ts-expect-error
      grecaptcha.reset(widgetId);
      toast({
        title: "Error Sending OTP",
        description: error.message,
      });
      setSentOTP(false);
    }
  };

  useEffect(() => {
    (async () => {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {}
      );
      const widgetId = await recaptchaVerifier.render();
      setCaptchaData({
        appVerifier: recaptchaVerifier,
        widgetId,
      });
    })();
  }, []);

  const supabase = createClient();

  const checkTheOtp: SubmitHandler<OTPSchemaType> = async (data) => {
    if (!confirmationResult) {
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(data.otp);
      console.log(result);
      await deleteUser(result.user);
      // (future me will handle this) check if the user deletion was successful before updating the Supabase user.

      const response = await supabase.auth.updateUser({
        data: { phoneNumber },
      });
      if (response.error) {
        // Handle Supabase update error
        console.error("Supabase update error:", response.error);
        return;
      }

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error Verifying OTP",
        description: error.message,
      });
    }
  };

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Toaster />
      <div className="mask-2"></div>
      <div className="gridd-2"></div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white border border-solid border-gray-200 w-14 h-14 flex items-center justify-center rounded-xl shadows">
            <img src={phoneNumberIcon.src} alt="" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-center leading-8 text-2xl text-gray-900">
              Verify Your Phone Number
            </h1>
            <p className="text-center font-normal leading-6 text-base text-gray-600">
              {sentOTP
                ? " We've sent a verification code to your phone. Enter the code to confirm your number and complete the onboarding."
                : "Click 'Send OTP' to receive a verification code on your phone."}
            </p>
            <Button variant={"link"} onClick={() => goback()} className="all">
              Change your number
            </Button>
          </div>
        </div>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(checkTheOtp)}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="otp">One-Time Password</Label>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  autoFocus
                  onComplete={() => submitButtonRef.current?.click()}
                  {...field}
                  disabled={!sentOTP}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm">{errors.otp.message}</p>
            )}
            {phoneNumberError && (
              <p className="text-red-500 text-sm">{phoneNumberError}</p>
            )}
          </div>
          <Button
            type={sentOTP ? "submit" : "button"}
            ref={submitButtonRef}
            className="mt-1"
            disabled={loading}
            onClick={!sentOTP ? sendOTP : undefined}
          >
            {sentOTP ? "Verify OTP" : attemptsNumber > 1 ? "Retry" : "Send OTP"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div id="recaptcha-container"></div>
        </form>
      </div>
    </>
  );
}
