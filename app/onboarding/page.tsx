"use client";

import accountIcon from "@/assets/accountIcon.svg";
import profileEditIcon from "@/assets/profileEditIcon.svg";
import phoneNumberIcon from "@/assets/phoneNumberIcon.svg";

import ProfileDetails from "@/app/onboarding/_onboardingSteps/ProfileDetails";
import PhoneNumber from "@/app/onboarding/_onboardingSteps/PhoneNumber";

export default function Onboarding() {
  return (
    <main className="px-4 pt-12 pb-6 flex flex-col gap-[132px] relative">
      {/* <ProfileDetails /> */}
      <PhoneNumber />
      <div>
        <div className="pb-1 flex gap-3 opacity-60">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={accountIcon.src} alt="" />
            </div>
            <div className="w-0.5 h-3 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Your Account
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Enter your email and password to get started.
            </p>
          </div>
        </div>
        <div className="pb-1 flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={profileEditIcon.src} alt="" className="w-6 h-6" />
            </div>
            <div className="w-0.5 h-3 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Profile Details
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Upload a picture and add your full name.
            </p>
          </div>
        </div>
        <div className="pb-1 flex gap-3 opacity-60">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={phoneNumberIcon.src} alt="" className="w-6 h-6" />
            </div>
            <div className="w-0.5 h-3 bg-gray-200 rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Phone Number
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Provide and verify your phone number.
            </p>
          </div>
        </div>
        <div className="pb-1 flex gap-3 opacity-60">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-white border border-solid border-gray-200 w-12 h-12 flex items-center justify-center rounded-xl shadows">
              <img src={accountIcon.src} alt="" />
            </div>
            <div className="w-0.5 h-3 bg-transparent rounded-sm"></div>
          </div>
          <div className="pt-1">
            <h2 className="font-semibold text-sm leading-5 text-gray-700">
              Verification
            </h2>
            <p className="font-normal text-sm leading-5 text-gray-600">
              Complete phone verification to secure your account.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
