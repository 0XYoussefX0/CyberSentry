"use client";

import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

import { useState, useRef, useEffect, MutableRefObject } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/OTPInput";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { OTPSchemaType } from "@/lib/types";

import { OTPSchema } from "@/lib/validationSchemas";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase/config";

import {
  signInWithPhoneNumber,
  ConfirmationResult,
  deleteUser,
} from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import useRecaptchaVerifier from "@/hooks/useRecaptchaVerifier";

import { motion } from "framer-motion";
import { createClient } from "@/lib/appwrite/client";

import { AppwriteException, Permission, Role } from "appwrite";

import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";

export default function VerifyPhoneNumber({
  goback,
  phoneNumberRef,
}: {
  goback: () => void;
  phoneNumberRef: MutableRefObject<string>;
}) {
  const [exit, setExit] = useState(false);
  const [sentOTP, setSentOTP] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const phoneNumber = phoneNumberRef.current;

  const [loading, setLoading] = useState(false);

  const [attemptsNumber, setAttemptsNumber] = useState(1);

  const router = useRouter();

  const captchaData = useRecaptchaVerifier("recaptcha-container");

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

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const sendOTP = async () => {
    setLoading(true);
    const { appVerifier, widgetId } = captchaData;
    if (!appVerifier) {
      setLoading(false);
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
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setAttemptsNumber((prev) => prev + 1);
      // @ts-expect-error
      grecaptcha.reset(widgetId);
      toast({
        title: "Error Sending OTP",
        description: error.message,
        toastType: "destructive",
      });
      setSentOTP(false);
    }
  };

  const checkTheOtp: SubmitHandler<OTPSchemaType> = async (data) => {
    if (!confirmationResult) {
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(data.otp);
      await deleteUser(result.user);

      setExit(true);
    } catch (error: any) {
      toast({
        title: "Error Verifying OTP",
        description: error.message,
        toastType: "destructive",
      });
    }

    try {
      const { databases, account } = await createClient();
      const user = await account.get();

      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        { phone_number: phoneNumber, completed_onboarding: true },
        [Permission.read(Role.users()), Permission.write(Role.user(user.$id))]
      );
    } catch (e) {
      const err = e as AppwriteException;
      return { status: "server_error", error: err.message };
    }
  };

  return (
    <motion.div
      initial={{ y: 50, scale: 0.8, opacity: 0 }}
      animate={
        exit
          ? { y: -50, scale: 0.8, opacity: 0 }
          : { y: 0, scale: 1, opacity: 1 }
      }
      onAnimationComplete={() => {
        if (exit) {
          router.push("/");
        }
      }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative lp:max-w-[420px] lp:w-full"
    >
      <Toaster />
      <div className="mask-2"></div>
      <div className="gridd-2"></div>
      <div className="flex flex-col gap-8 h-[484px]">
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
          <div className="flex flex-col items-center gap-1.5">
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
            onClick={sentOTP ? undefined : sendOTP}
          >
            {loading && !sentOTP && !(attemptsNumber > 1)
              ? "Sending..."
              : loading && sentOTP
              ? "Verifying..."
              : !loading && sentOTP
              ? "Verify OTP"
              : !loading && attemptsNumber > 1
              ? "Resend"
              : "Send OTP"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="mx-auto" id="recaptcha-container"></div>
        </form>
      </div>
    </motion.div>
  );
}
