"use client";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";

import { Button } from "@/components/ui/Button";

import { SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { PasswordSchema, PasswordSchemaType } from "@/lib/types";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

import keyIcon from "@/assets/keyIcon.svg";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

import { useState } from "react";

import RevealButton from "@/components/ui/RevealButton";

import { passwordStrength } from "check-password-strength";

import PasswordContaintsChecker from "@/components/PasswordContaintsChecker";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";
import resetPassword from "../actions/(auth)/resetPassword";
export default function ResetPassword() {
  const [revealPassword, setRevealPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSchemaType>({
    resolver: valibotResolver(PasswordSchema),
  });

  const password = watch("password");

  const passwordStrengthResult = passwordStrength(password);

  const supabase = createClient();
  const handlePasswordResetting: SubmitHandler<PasswordSchemaType> = async (
    data
  ) => {
    const response = await resetPassword(data);
    if (response && response.status === "server_error") {
      toast({
        title: "Something went wrong",
        description: response.message,
      });
    } else if (response && response.errors) {
      for (const error of response.errors) {
        if (error.path && error.path[0].key === "password") {
          setError("password", {
            type: "manual",
            message: error.message,
          });
        }
      }
    }
  };

  return (
    <main className="px-4 pt-12 pb-6 lp:pb-16 flex flex-col gap-[132px] min-h-screen h-full justify-between relative lp:items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative lp:max-w-[420px] lp:w-full"
      >
        <Toaster />
        <div className="mask-2"></div>
        <div className="gridd-2"></div>
        <div className="flex flex-col gap-8 h-[484px]">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white border border-solid border-gray-200 w-14 h-14 flex items-center justify-center rounded-xl shadows">
              <img src={keyIcon.src} alt="" className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-center leading-8 text-2xl text-gray-900">
                Reset Password
              </h1>
              <p className="text-center font-normal leading-6 text-base text-gray-600">
                {
                  "You’re just a step away from creating a new password. Please enter and confirm your new password below."
                }
              </p>
            </div>
          </div>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(handlePasswordResetting)}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">New Password</Label>
                <div className="relative w-full">
                  <Input
                    {...register("password")}
                    id="password"
                    name="password"
                    type={revealPassword ? "text" : "password"}
                    placeholder="Create a password"
                    aria-describedby="password-help password-hint-0 password-hint-1 password-hint-2 password-hint-3"
                    className="w-full pr-10"
                  />
                  <RevealButton
                    revealPassword={revealPassword}
                    setRevealPassword={setRevealPassword}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm font-normal">
                    {errors.password.message}
                  </p>
                )}
                <span id="password-help" className="sr-only">
                  {revealPassword
                    ? "Password is visible"
                    : "Password is hidden"}
                </span>
                <PasswordStrengthChecker
                  passwordStrengthResult={passwordStrengthResult}
                />
              </div>
              <PasswordContaintsChecker
                passwordStrengthResult={passwordStrengthResult}
              />
            </div>
            <Button className="mt-1" disabled={isSubmitting}>
              Send Reset Link
            </Button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
