"use client";

import { RefObject, useEffect, useState } from "react";
import { ProgressBar } from "react-aria-components";

type ProgressBarPos = {
  top: undefined | number;
  left: undefined | number;
  width: undefined | number;
};

type OnBoardingProgressBarProps = {
  stepIndicatorContainerRef: RefObject<HTMLDivElement>;
  progressBarStartRef: RefObject<HTMLDivElement>;
  progressBarEndRef: RefObject<HTMLDivElement>;
  progressValue: number;
  ariaLabel: string;
};

function OnBoardingProgressBar({
  stepIndicatorContainerRef,
  progressBarStartRef,
  progressBarEndRef,
  progressValue,
  ariaLabel,
}: OnBoardingProgressBarProps) {
  const [progressBarPos, setProgressBarPos] = useState<ProgressBarPos>({
    top: undefined,
    left: undefined,
    width: undefined,
  });

  useEffect(() => {
    if (
      progressBarStartRef.current &&
      progressBarEndRef.current &&
      stepIndicatorContainerRef.current
    ) {
      const {
        top: stepIndicatorContainerTopPos,
        left: stepIndicatorContainerLeftPos,
      } = stepIndicatorContainerRef.current?.getBoundingClientRect();

      const { top: progressBarStartTopPos, left: progressBarStartLeftPos } =
        progressBarStartRef.current?.getBoundingClientRect();

      const progressBarLeftPos =
        progressBarStartLeftPos - stepIndicatorContainerLeftPos;

      const progressBarTopPos =
        progressBarStartTopPos - stepIndicatorContainerTopPos;

      const progressBarWidth =
        progressBarEndRef.current?.getBoundingClientRect().right -
        progressBarStartLeftPos;

      setProgressBarPos({
        top: progressBarTopPos,
        left: progressBarLeftPos,
        width: progressBarWidth,
      });
    }
  }, []);
  return (
    <ProgressBar aria-label={ariaLabel} value={progressValue}>
      {({ percentage }) => (
        <div
          style={{
            position: "absolute",
            top: progressBarPos.top,
            left: progressBarPos.left,
            width: progressBarPos.width,
            background:
              "linear-gradient(to right, #344054 0%, #344054 100%) no-repeat, linear-gradient(to right, #e4e7ec 0%, #e4e7ec 100%) no-repeat",
            height: "2px",
            backgroundSize: `${percentage}% 100%, 100% 100%`,
            backgroundPosition: "left center, left center",
            backgroundRepeat: "no-repeat",
            transition: "background-size 0.4s ease",
            borderRadius: "2px",
          }}
        ></div>
      )}
    </ProgressBar>
  );
}

export default OnBoardingProgressBar;
