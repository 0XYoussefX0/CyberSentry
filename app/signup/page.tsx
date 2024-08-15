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
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { useState } from "react";

import RevealButton from "@/components/ui/RevealButton";

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

  return (
    <div className="px-4 pt-12 flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <nav>
          <Link href="/">
            <img src={Logo.src} className="w-10 h-10" />
          </Link>
        </nav>
        <div className="flex gap-2 flex-col">
          <h1 className="font-semibold text-2xl leading-8 text-gray-900">
            Sign up
          </h1>
          <p className="font-normal text-base leading-6 text-gray-600">
            Sign up now to secure your business with our cutting-edge
            vulnerability scans. Protect your data, prevent breaches, and ensure
            peace of mind.
          </p>
        </div>
      </div>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />
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
            <span id="password-help" className="sr-only">
              {revealPassword ? "Password is visible" : "Password is hidden"}
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
        <Button className="mt-1">Get started</Button>
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
