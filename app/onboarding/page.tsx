"use client";

import accountIcon from "@/assets/accountIcon.svg";
import profileEditIcon from "@/assets/profileEditIcon.svg";
import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";
import notificationMessageIcon from "@/assets/notificationMessageIcon.svg";

import ProfileDetails from "@/components/_onboardingSteps/ProfileDetails";
import PhoneNumber from "@/components/_onboardingSteps/PhoneNumber";
import VerifyPhoneNumber from "@/components/_onboardingSteps/VerifyPhoneNumber";
import { createClient } from "@/lib/supabase/client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { isValidPhoneNumber } from "libphonenumber-js";

import { auth } from "@/lib/firebase/config";

auth.useDeviceLanguage();

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const supabase = createClient();

  const router = useRouter();

  const goback = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const steps = useMemo(
    () => [
      {
        title: "Your Account",
        description: "Enter your email and password to get started.",
        icon: accountIcon,
        component: null,
      },
      {
        title: "Profile Details",
        description: "Upload a picture and add your full name.",
        icon: profileEditIcon,
        component: <ProfileDetails nextStep={nextStep} />,
      },
      {
        title: "Phone Number",
        description: "Provide and verify your phone number.",
        icon: phoneNumberIcon,
        component: <PhoneNumber nextStep={nextStep} />,
      },
      {
        title: "Verification",
        description: "Complete phone verification to secure your account.",
        icon: notificationMessageIcon,
        component: <VerifyPhoneNumber goback={goback} />,
      },
    ],
    []
  );

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // inser the avatar image and full name inside the user object, to make everything easy for you

      // const { data, error } = await supabase
      //   .from("profiles")
      //   .select("avatarimage, full_name")
      //   .eq("user_id", user.id)
      //   .single();

      if (!user.user_metadata.avatar_image || !user.user_metadata.full_name) {
        setCurrentStep(1);
      } else if (user.phone) {
        router.push("/");
      } else {
        const phoneNumber = localStorage.getItem("phoneNumber");
        if (!phoneNumber) {
          setCurrentStep(2);
          return;
        }
        const isPhoneNumberValid = isValidPhoneNumber(phoneNumber);

        if (!isPhoneNumberValid) {
          setCurrentStep(2);
          return;
        }

        setCurrentStep(3);
      }
    })();
  }, []);

  if (currentStep === 0) return;

  return (
    <main className="px-4 pt-12 pb-6 flex flex-col gap-[132px] relative">
      {steps[currentStep].component}
      <div>
        {steps.map(({ title, description, icon }, index) => {
          return (
            <div
              className={`pb-1 flex gap-3 ${
                currentStep === index ? "" : "opacity-60"
              }`}
              key={title}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
                  <img src={icon.src} alt="" className="w-6 h-6" />
                </div>
                <div className="w-0.5 h-3 bg-gray-200 rounded-sm"></div>
              </div>
              <div className="pt-1">
                <h2 className="font-semibold text-sm leading-5 text-gray-700">
                  {title}
                </h2>
                <p className="font-normal text-sm leading-5 text-gray-600">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
