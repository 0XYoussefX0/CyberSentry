"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { EmailSchema } from "@pentest-app/schemas/client";
import type { EmailSchemaType } from "@pentest-app/types/client";

import keyIcon from "@/assets/keyIcon.svg";
import { trpcClient } from "@/lib/trpcClient";
import { useRouter } from "next/navigation";

import * as v from "valibot";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<EmailSchemaType>({
    resolver: valibotResolver(EmailSchema),
  });

  const router = useRouter();

  const sendResetEmail = trpcClient.sendResetEmail.useMutation({
    onSuccess: (data) => {
      if (data.status === "success") {
        const email = getValues("email");

        encryptString.mutate({ email });
      }
    },
    onError: (error) => {
      if (!error.data?.valibotError) {
        toast({
          title: "Server Error",
          description: error.message,
          toastType: "destructive",
        });
      }

      const issues = v.flatten<typeof EmailSchema>(error.data?.valibotError!);
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

  const encryptString = trpcClient.encryptString.useMutation({
    onSuccess: (data) => {
      router.push(`/check-email-reset?user=${data}`);
    },
  });

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
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
                Forgot Your Password
              </h1>
              <p className="text-center font-normal text-base text-gray-600 leading-6">
                {
                  "Enter your email below, and we'll send you a link to reset it."
                }
              </p>
            </div>
          </div>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(
              async ({ email }) => await sendResetEmail.mutate({ email }),
            )}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="font-normal text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button className="mt-1" disabled={isSubmitting}>
              Send Reset Link
            </Button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
