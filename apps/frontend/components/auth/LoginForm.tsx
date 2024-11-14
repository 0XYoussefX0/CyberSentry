"use client";

import { useToast } from "@/hooks/use-toast";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { LoginSchema } from "@pentest-app/schemas/client";
import type { LoginSchemaType } from "@pentest-app/types/client";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import RememberMeCheckbox from "@/components/RememberMeCheckbox";
import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import RevealButton from "@/components/ui/RevealButton";
import { trpcClient } from "@/lib/trpcClient";
import * as v from "valibot";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [revealPassword, setRevealPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: valibotResolver(LoginSchema),
  });

  const router = useRouter();

  const login = trpcClient.login.useMutation({
    onSuccess: () => {
      router.push("/check-email-confirmation");
    },
    onError: (error) => {
      if (!error.data?.valibotError) {
        toast({
          title: "Server Error",
          description: error.message,
          toastType: "destructive",
        });
        return;
      }

      const issues = v.flatten<typeof LoginSchema>(error.data?.valibotError!);
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

  const { isPending } = login;

  return (
    <div className="flex flex-col gap-8 px-4 py-12 lg:max-w-[380px] lg:px-0 lg:py-0">
      <div className="flex flex-col gap-6">
        <nav className="lg:hidden">
          <Link href="/" className="inline-block h-fit w-[200px]">
            <Logo />
          </Link>
        </nav>
        <div className="flex flex-col gap-2 lg:gap-3">
          <h1 className="font-semibold text-2xl text-gray-900 leading-8 lg:text-4xl lg:leading-11 lg:tracking-[-0.72px]">
            Login
          </h1>
          <p className="font-normal text-base text-gray-600 leading-6">
            Welcome back! Log in to access your personalized dashboard, monitor
            your security status, and stay ahead of potential threats. Your
            peace of mind is just a click away.
          </p>
        </div>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit((data) => login.mutate(data))}
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
              <p className="font-normal text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
            <span id="password-help" className="sr-only">
              {revealPassword ? "Password is visible" : "Password is hidden"}
            </span>
          </div>
        </div>
        <div className="mt-1 flex justify-between">
          <Controller
            control={control}
            name="remember_me"
            defaultValue={false}
            render={({ field }) => <RememberMeCheckbox {...field} />}
          />
          <Link
            href="/forgotpassword"
            className="font-medium text-brand-700 text-sm leading-5"
          >
            Forgot your password?
          </Link>
        </div>
        <Button className="mt-1" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="text-center font-normal text-gray-600 text-sm leading-5">
        {"Don't have an account? "}
        <Link
          href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_APP_EMAIL!}`}
          className="font-medium text-brand-700"
        >
          Email the admin
        </Link>
      </p>
    </div>
  );
}
