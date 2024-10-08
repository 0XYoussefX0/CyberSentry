"use client";

import { useMemo, useRef, useState } from "react";

import { auth } from "@/lib/firebase/config";
import { OnboardingSteos, OnBoardingWrapperProps } from "@/lib/types";

import PhoneNumber from "@/components/_onboardingSteps/PhoneNumber";
import ProfileDetails from "@/components/_onboardingSteps/ProfileDetails";
import VerifyPhoneNumber from "@/components/_onboardingSteps/VerifyPhoneNumber";
import StepIndicator from "@/components/StepIndicator";

import accountIcon from "@/assets/accountIcon.svg";
import notificationMessageIcon from "@/assets/notificationMessageIcon.svg";
import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";
import profileEditIcon from "@/assets/profileEditIcon.svg";

auth.useDeviceLanguage();

export default function OnBoardingWrapper({
  initialStep,
}: OnBoardingWrapperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  const phoneNumberRef = useRef<string>("");

  const goback = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const steps: OnboardingSteos = useMemo(
    () => [
      {
        title: "Your Account",
        description: "Enter your email and password to get started.",
        concise_description: "Enter email and password",
        icon: accountIcon,
        component: null,
      },
      {
        title: "Profile Details",
        description: "Upload a picture and add your full name.",
        concise_description: "Upload a photo & add your name",
        icon: profileEditIcon,
        component: <ProfileDetails nextStep={nextStep} />,
      },
      {
        title: "Phone Number",
        description: "Provide and verify your phone number.",
        concise_description: "Verify your phone number",
        icon: phoneNumberIcon,
        component: (
          <PhoneNumber phoneNumberRef={phoneNumberRef} nextStep={nextStep} />
        ),
      },
      {
        title: "Verification",
        description: "Complete phone verification to secure your account.",
        concise_description: "Complete phone verification",
        icon: notificationMessageIcon,
        component: (
          <VerifyPhoneNumber phoneNumberRef={phoneNumberRef} goback={goback} />
        ),
      },
    ],
    [],
  );

  return (
    <main className="px-4 pt-12 pb-6 lp:pb-16 flex flex-col gap-[132px] min-h-screen h-full justify-between relative lp:items-center">
      {steps[currentStep].component}
      <StepIndicator currentStep={currentStep} steps={steps} />
    </main>
  );
}
