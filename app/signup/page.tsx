"use client";

import Link from "next/link";
import Logo from "@/assets/logo.svg";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import CheckMark from "@/components/ui/CheckMark";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";
import { passwordStrength } from "check-password-strength";
import {
  PasswordConstraints,
  SignUpSchemaType,
  SignUpSchema,
} from "@/lib/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { useState } from "react";

import RevealButton from "@/components/ui/RevealButton";

import signup from "@/app/actions/(auth)/signup";

import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

import CheckEmailModal from "@/components/CheckEmailModal";

import emailIcon from "@/assets/emailIcon.svg";

const passwordConstraints: PasswordConstraints = [
  {
    id: "length",
    text: "Must be at least 8 characters long.",
  },
  {
    id: "symbol",
    text: "Must include at least one special character (e.g., !, @, #, $).",
  },
  {
    id: "uppercase",
    text: "Must contain an uppercase letter (A-Z).",
  },
  {
    id: "number",
    text: "Must include at least one number (0-9).",
  },
];

export default function Signup() {
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: valibotResolver(SignUpSchema),
  });

  const password = watch("password");

  const passwordStrengthResult = passwordStrength(password);

  const handleSignUp: SubmitHandler<SignUpSchemaType> = async (data) => {
    const response = await signup(data);
    if (response.status === "serverError") {
      toast({
        title: "Server Error",
        description: response.message,
      });
    } else if (response.status === "validation_error" && response.errors) {
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
    } else {
      setConfirmEmailModal({
        email: data.email,
        open: true,
      });
      reset();
    }
  };

  return (
    <div className="lg:p-4 lg:flex lg:gap-4 min-h-screen h-full">
      <div className="lg:w-1/2 flex flex-col items-center lg:gap-[130px] lg:justify-between lg:p-4 ">
        <div className="gap-2 items-center w-full hidden lg:flex">
          <Link href="/">
            <img src={Logo.src} className="w-10 h-10" alt="" />
          </Link>
          <div className="font-semibold text-base tracking-[0.16px] text-black">
            CyberSentry
          </div>
        </div>
        <div className="px-4 py-12 lg:py-0 flex flex-col gap-8 lg:px-0 lg:max-w-[380px]">
          <CheckEmailModal
            open={confirmEmailModal.open}
            setOpen={setConfirmEmailModal}
            email={confirmEmailModal.email}
          />
          <Toaster />
          <div className="flex flex-col gap-6">
            <nav className="lg:hidden">
              <Link href="/">
                <img src={Logo.src} className="w-10 h-10" />
              </Link>
            </nav>
            <div className="flex gap-2 lg:gap-3 flex-col">
              <h1 className="font-semibold text-2xl lg:text-4xl lg:leading-11 lg:tracking-[-0.72px] leading-8 text-gray-900">
                Sign up
              </h1>
              <p className="font-normal text-base leading-6 text-gray-600">
                Sign up now to secure your business with our cutting-edge
                vulnerability scans. Protect your data, prevent breaches, and
                ensure peace of mind.
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
                  {revealPassword
                    ? "Password is visible"
                    : "Password is hidden"}
                </span>
                <PasswordStrengthChecker
                  passwordStrengthResult={passwordStrengthResult}
                />
              </div>
              <div className="flex flex-col gap-2">
                {passwordConstraints.map(({ id, text }, index) => {
                  let success = false;
                  if (id === "length") {
                    success = passwordStrengthResult.length >= 8;
                  } else {
                    success = passwordStrengthResult.contains.includes(id);
                  }
                  return (
                    <div className="flex items-center gap-2" key={id}>
                      <CheckMark success={success} />
                      <p
                        id={`password-hint-${index}`}
                        className={`${
                          success ? "text-green-400" : "text-gray-600"
                        } transition-colors duration-300 font-normal text-xs leading-5 flex-1`}
                      >
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Button className="mt-1" disabled={isSubmitting}>
              Get started
            </Button>
          </form>
          <p className="font-normal text-sm leading-5 text-gray-600 text-center">
            {"Already have an account? "}
            <Link href="/login" className="font-semibold text-brand-700">
              Log in
            </Link>
          </p>
        </div>
        <div className="justify-between items-center w-full hidden lg:flex">
          <div className="font-normal text-sm leading-5 text-gray-600">
            © CyberSentry 2024
          </div>
          <div className="flex items-center gap-2">
            <img src={emailIcon.src} alt="" className="w-4 h-4 mt-[3px]" />
            <div className="font-normal text-sm leading-5 text-gray-600">
              team@cybersentry.tech
            </div>
          </div>
        </div>
      </div>
      <div className="bg-brand-800 rounded-[20px] w-1/2 hidden lg:block"></div>
    </div>
  );
}
