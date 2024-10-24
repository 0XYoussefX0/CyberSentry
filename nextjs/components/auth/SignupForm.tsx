"use client";

import { useState } from "react";
import Link from "next/link";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { passwordStrength } from "check-password-strength";
import { SubmitHandler, useForm } from "react-hook-form";

import { SignUpSchemaType } from "@/lib/types";
import { SignUpSchema } from "@/lib/validationSchemas";
import { useToast } from "@/hooks/use-toast";
import signup from "@/app/actions/(auth)/signup";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import RevealButton from "@/components/ui/RevealButton";
import { Toaster } from "@/components/ui/toaster";
import CheckEmailModal from "@/components/CheckEmailModal";
import Logo from "@/components/icons/Logo";
import PasswordContaintsChecker from "@/components/PasswordContaintsChecker";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";

export default function SignupForm() {
  const [revealPassword, setRevealPassword] = useState(false);
  const [confirmEmailModal, setConfirmEmailModal] = useState({
    email: "",
    open: false,
  });

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: valibotResolver(SignUpSchema),
  });

  const password = watch("password");

  const passwordStrengthResult = passwordStrength(password);

  const handleSignUp: SubmitHandler<SignUpSchemaType> = async (data) => {
    const response = await signup(data);
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
          } else if (error.path && error.path[0].key === "password") {
            setError("password", {
              type: "manual",
              message: error.message,
            });
          }
        }
        break;
      case "server_error":
        toast({
          title: "Server Error",
          description: response.error,
          toastType: "destructive",
        });
        break;
    }
  };

  return (
    <div className="px-4 py-12 lg:py-0 flex flex-col gap-8 lg:px-0 lg:max-w-[380px]">
      <CheckEmailModal
        open={confirmEmailModal.open}
        setOpen={setConfirmEmailModal}
        email={confirmEmailModal.email}
        message={"We sent a verification link to"}
      />
      <Toaster />
      <div className="flex flex-col gap-6">
        <nav className="lg:hidden">
          <Link href="/" className="h-fit w-[200px] inline-block">
            <Logo />
          </Link>
        </nav>
        <div className="flex gap-2 lg:gap-3 flex-col">
          <h1 className="font-semibold text-2xl lg:text-4xl lg:leading-11 lg:tracking-[-0.72px] leading-8 text-gray-900">
            Sign up
          </h1>
          <p className="font-normal text-base leading-6 text-gray-600">
            Sign up now to secure your business with our cutting-edge
            vulnerability scans. Protect your data, prevent breaches, and ensure
            peace of mind.
          </p>
        </div>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleSignUp)}
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
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
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
              {revealPassword ? "Password is visible" : "Password is hidden"}
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
          {isSubmitting ? "Signing up..." : "Get started"}
        </Button>
      </form>
      <p className="font-normal text-sm leading-5 text-gray-600 text-center">
        {"Already have an account? "}
        <Link href="/login" className="font-semibold text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
