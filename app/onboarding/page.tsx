"use client";

import accountIcon from "@/assets/accountIcon.svg";
import profileEditIcon from "@/assets/profileEditIcon.svg";
import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";
import notificationMessageIcon from "@/assets/notificationMessageIcon.svg";

import ProfileDetails from "@/components/_onboardingSteps/ProfileDetails";
import PhoneNumber from "@/components/_onboardingSteps/PhoneNumber";
import VerifyPhoneNumber from "@/components/_onboardingSteps/VerifyPhoneNumber";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { isValidPhoneNumber } from "libphonenumber-js";

import { auth } from "@/lib/firebase/config";
import { OnboardingSteos } from "@/lib/types";

import StepIndicator from "@/components/StepIndicator";
import { createClient } from "@/lib/appwrite/clientConfig";
import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/appwrite/envConfig";

auth.useDeviceLanguage();

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const phoneNumberRef = useRef<string>("");

  const router = useRouter();

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
    []
  );

  useEffect(() => {
    (async () => {
      const { account, databases } = await createClient();
      const user = await account.get();
      const { avatar_image, phone_number } = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id
      );

      const full_name = user.name;

      if (!user) return;

      if (!avatar_image || !full_name) {
        setCurrentStep(1);
      } else if (!phone_number) {
        setCurrentStep(2);
      } else {
        router.push("/");
      }
    })();
  }, []);

  if (currentStep === 0) return;

  return (
    <main className="px-4 pt-12 pb-6 lp:pb-16 flex flex-col gap-[132px] min-h-screen h-full justify-between relative lp:items-center">
      {steps[currentStep].component}
      <StepIndicator currentStep={currentStep} steps={steps} />
    </main>
  );
}
