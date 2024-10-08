"use client";

import { useState } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";

import { EmailSchemaType } from "@/lib/types";
import { EmailSchema } from "@/lib/validationSchemas";
import { toast } from "@/hooks/use-toast";
import forgotPassword from "@/app/actions/(auth)/forgotPassword";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Toaster } from "@/components/ui/toaster";
import CheckEmailModal from "@/components/CheckEmailModal";

import keyIcon from "@/assets/keyIcon.svg";

export default function ForgotPassword() {
  const [confirmEmailModal, setConfirmEmailModal] = useState({
    email: "",
    open: false,
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmailSchemaType>({
    resolver: valibotResolver(EmailSchema),
  });

  const sendResetPasswordEmail: SubmitHandler<EmailSchemaType> = async (
    data,
  ) => {
    const response = await forgotPassword(data);
    switch (response.status) {
      case "success":
        setConfirmEmailModal({
          email: data.email,
          open: true,
        });
        break;
      case "validation_error":
        for (const error of response.errors) {
          if (error.path && error.path[0].key === "email") {
            setError("email", {
              type: "manual",
              message: error.message,
            });
          }
        }
        break;
      case "server_error":
        toast({
          title: "Error Sending Reset Link",
          description: response.error,
          toastType: "destructive",
        });
        break;
    }
  };

  return (
    <main className="px-4 pt-12 pb-6 lp:pb-16 flex flex-col gap-[132px] min-h-screen h-full justify-between relative lp:items-center">
      <CheckEmailModal
        open={confirmEmailModal.open}
        setOpen={setConfirmEmailModal}
        email={confirmEmailModal.email}
        message={"We sent a reset link to"}
      />
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
                Forgot Your Password
              </h1>
              <p className="text-center font-normal leading-6 text-base text-gray-600">
                {
                  "Enter your email below, and we'll send you a link to reset it."
                }
              </p>
            </div>
          </div>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(sendResetPasswordEmail)}
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
                <p className="text-red-500 text-sm font-normal">
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
    </main>
  );
}
