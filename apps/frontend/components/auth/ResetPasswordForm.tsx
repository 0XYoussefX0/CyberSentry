"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "@/hooks/use-toast";
import { PasswordSchema } from "@pentest-app/schemas/client";
import type { PasswordSchemaType } from "@pentest-app/types/client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import RevealButton from "@/components/ui/RevealButton";

import keyIcon from "@/assets/keyIcon.svg";
import { trpcClient } from "@/lib/trpcClient";
import * as v from "valibot";

export default function ResetPasswordForm() {
  const [exit, setExit] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordSchemaType>({
    resolver: valibotResolver(PasswordSchema),
  });

  const router = useRouter();

  const resetPassword = trpcClient.resetPassword.useMutation({
    onSuccess: () => {
      toast({
        title:
          "Your Password has Changed Successfully. You can now Login in with your new credentials",
        toastType: "successful",
      });
      setExit(true);
    },
    onError: (error) => {
      if (!error.data?.valibotError) {
        toast({
          title: "Server Error",
          description: error.message,
          toastType: "destructive",
        });
      }

      const issues = v.flatten<typeof PasswordSchema>(
        error.data?.valibotError!,
      );
      if (!issues.nested) return;

      const properties = Object.keys(issues.nested);

      for (const property of properties) {
        const errMessage =
          issues.nested[property as keyof typeof issues.nested];
        if (!errMessage) return;

        setError(property as keyof typeof issues.nested, {
          type: "manual",
          message: errMessage[0],
        });
      }
    },
  });

  const { isPending } = resetPassword;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={
        exit
          ? { y: -50, scale: 0.8, opacity: 0 }
          : { y: 0, scale: 1, opacity: 1 }
      }
      onAnimationComplete={() => {
        if (exit) {
          router.push("/login");
        }
      }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative lp:w-full lp:max-w-[420px]"
    >
      <div className="mask-2" />
      <div className="gridd-2" />
      <div className="flex h-[484px] flex-col gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="shadows flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 border-solid bg-white">
            <img src={keyIcon.src} alt="" className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-center font-semibold text-2xl text-gray-900 leading-8">
              Reset Password
            </h1>
            <p className="text-center font-normal text-base text-gray-600 leading-6">
              {
                "You're just a step away from creating a new password. Please enter and confirm your new password below."
              }
            </p>
          </div>
        </div>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(
            async ({ password }) => await resetPassword.mutate({ password }),
          )}
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
                <p className="font-normal text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              <span id="password-help" className="sr-only">
                {revealPassword ? "Password is visible" : "Password is hidden"}
              </span>
            </div>
          </div>
          <Button className="mt-1" disabled={isPending}>
            {isPending ? "Resetting..." : "Reset"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
