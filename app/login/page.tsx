"use client";

import Link from "next/link";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { useState } from "react";

import RevealButton from "@/components/ui/RevealButton";

import login from "@/app/actions/(auth)/login";

import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

import Logo from "@/components/Logo";

import emailIcon from "@/assets/emailIcon.svg";

import RememberMeCheckbox from "@/components/RememberMeCheckbox";
import { LoginSchema, LoginSchemaType } from "@/lib/types";

import { useRouter } from "next/navigation";

export default function Login() {
  const [revealPassword, setRevealPassword] = useState(false);

  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: valibotResolver(LoginSchema),
  });

  const router = useRouter();

  const f = watch();
  console.log(f);

  const handleSignUp: SubmitHandler<LoginSchemaType> = async (data) => {
    const response = await login(data);
    console.log(response);
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
      router.push("/");
      reset();
    }
  };

  return (
    <div className="lg:p-4 lg:flex lg:gap-4 min-h-screen h-full">
      <div className="lg:w-1/2 flex flex-col items-center lg:gap-[130px] lg:justify-between lg:p-4 ">
        <div className="w-full">
          <Link href="/" className="h-fit w-[200px] hidden lg:inline-block">
            <Logo />
          </Link>
        </div>
        <div className="px-4 py-12 lg:py-0 flex flex-col gap-8 lg:px-0 lg:max-w-[380px]">
          <Toaster />
          <div className="flex flex-col gap-6">
            <nav className="lg:hidden">
              <Link href="/" className="h-fit w-[200px] inline-block">
                <Logo />
              </Link>
            </nav>
            <div className="flex gap-2 lg:gap-3 flex-col">
              <h1 className="font-semibold text-2xl lg:text-4xl lg:leading-11 lg:tracking-[-0.72px] leading-8 text-gray-900">
                Login
              </h1>
              <p className="font-normal text-base leading-6 text-gray-600">
                Welcome back! Log in to access your personalized dashboard,
                monitor your security status, and stay ahead of potential
                threats. Your peace of mind is just a click away.
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
              </div>
            </div>
            <div className="mt-1 flex justify-between">
              <Controller
                control={control}
                name="rememberMe"
                defaultValue={false}
                render={({ field }) => <RememberMeCheckbox {...field} />}
              />
              <Link
                href="/forgotpassword"
                className="font-medium text-sm leading-5 text-brand-700"
              >
                Forgot your password?
              </Link>
            </div>
            <Button className="mt-1" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="font-normal text-sm leading-5 text-gray-600 text-center">
            {"Don't have an account? "}
            {process.env.ENVIRONMENT === "production" ? (
              <Link
                href="mailto:arib@ims-technology.ma"
                className="font-medium text-brand-700"
              >
                Email admin
              </Link>
            ) : (
              <Link href="/signup" className="font-medium text-brand-700">
                Sign up
              </Link>
            )}
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
