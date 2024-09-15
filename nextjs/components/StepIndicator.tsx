"use client";

import { useEffect, useRef, useState } from "react";

import { OnboardingSteos } from "@/lib/types";

import OnBoardingProgressBar from "./OnBoardingProgressBar";

type StepIndicatorProps = {
  steps: OnboardingSteos;
  currentStep: number;
};

function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const stepIndicatorContainerRef = useRef<HTMLDivElement>(null);
  const progressBarStartRef = useRef<HTMLDivElement>(null);
  const progressBarEndRef = useRef<HTMLDivElement>(null);

  const stepsLength = steps.length;

  // use media queries to determine whether you should render the progress bar and also when you don't render
  // the progress bar provide the non sighted users with some feedback so they know which step they are on
  // also you need the media query to change the logic of this component

  return (
    <div className="lp:flex relative" ref={stepIndicatorContainerRef}>
      <OnBoardingProgressBar
        ariaLabel={`Onboarding progress: Step ${
          currentStep + 1
        } out of ${stepsLength}`}
        progressBarEndRef={progressBarEndRef}
        progressBarStartRef={progressBarStartRef}
        stepIndicatorContainerRef={stepIndicatorContainerRef}
        progressValue={(currentStep / stepsLength) * 100 + currentStep * 8}
      />
      {steps.map(({ title, description, icon, concise_description }, index) => {
        return (
          <div
            className="pb-1 flex gap-3 lp:flex-col transition-opacity"
            key={title}
          >
            <div className="flex flex-col lp:flex-row items-center gap-1 lg:gap-0">
              {index !== 0 && (
                <div
                  ref={
                    index === stepsLength - 1 ? progressBarEndRef : undefined
                  }
                  className={`hidden lp:block lp:w-[100px] lp:h-0.5`}
                ></div>
              )}
              <div
                className={`bg-white relative z-10 ${
                  index === 0 && "lp:ml-[100px]"
                } ${
                  index === stepsLength - 1 && "lp:mr-[100px]"
                } lp:rounded-lg border border-solid border-gray-200 w-12 h-12 lp:w-10 lp:h-10 flex items-center justify-center rounded-xl shadows`}
              >
                <img
                  src={icon.src}
                  alt=""
                  className={`w-6 h-6 lp:w-5 lp:h-5 transition-opacity ${
                    index > currentStep ? "opacity-60" : ""
                  }`}
                />
              </div>
              {index !== stepsLength - 1 && (
                <div
                  ref={index === 0 ? progressBarStartRef : undefined}
                  className={`w-0.5 lp:w-[100px] lp:h-0.5 h-3`}
                ></div>
              )}
            </div>
            <div
              className={`pt-1 lp:text-center transition-opacity ${
                index > currentStep ? "opacity-60" : ""
              }`}
            >
              <h2 className="font-semibold text-sm leading-5 text-gray-700">
                {title}
              </h2>
              <p className="font-normal lp:hidden text-sm leading-5 text-gray-600">
                {description}
              </p>
              <p className="font-normal hidden lp:block text-sm leading-5 text-gray-600">
                {concise_description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
