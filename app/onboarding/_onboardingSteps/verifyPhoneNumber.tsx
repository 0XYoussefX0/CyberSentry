"use client";

import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

import { useEffect, useState, useRef } from "react";

import verifyPhoneNumber from "@/app/actions/(auth)/verifyPhoneNumber";
import sendOTP from "@/app/actions/(auth)/sendOTP";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/OTPInput";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { OTPSchema, OTPSchemaType } from "@/lib/types";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function VerifyPhoneNumber({ goback }: { goback: () => void }) {
  const [sentOTP, setSentOTP] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const phoneNumber = localStorage.getItem("phoneNumber") as string;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OTPSchemaType>({
    resolver: valibotResolver(OTPSchema),
  });

  useEffect(() => {
    (async () => {
      const response = await sendOTP(phoneNumber);
      if (!response) return;
      if (response.status === "error") {
        setPhoneNumberError(response.message as string);
      }
      if (response.status === "success") {
        setSentOTP(true);
      }
    })();
  }, []);

  const checkTheOtp: SubmitHandler<OTPSchemaType> = async (data) => {
    setLoading(true);
    const response = await verifyPhoneNumber(phoneNumber, data.otp);
    if (!response) return;
    if (response.status === "error" && response.type === "otp") {
      setError("otp", { message: response.message });
    }
    if (response.status === "error" && response.type === "phoneNumber") {
      setPhoneNumberError(response.message);
    }
    if (response.status === "success") {
      router.push("/");
    }
    setLoading(false);
  };

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
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
                ? " We've sent a verification code to your phone. Enter the code to confirm your number and complete the setup."
                : "We are sending a verification code to your phone. Please wait for the code."}
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
          <Button ref={submitButtonRef} className="mt-1" disabled={loading}>
            Continue
          </Button>
        </form>
      </div>
    </>
  );
}
