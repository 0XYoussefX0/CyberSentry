import React from "react";
import { Result } from "check-password-strength";

type PasswordStrengthCheckerProps = {
  passwordStrengthResult: Result<string>;
};

const passwordStates = [
  { color: "#FF4C4C", label: "Weak" },
  { color: "#FF8243", label: "Fair" },
  { color: "#F0BE4C", label: "Good" },
  { color: "#00CD52", label: "Excellent" },
];

function PasswordStrengthChecker({
  passwordStrengthResult,
}: PasswordStrengthCheckerProps) {
  return (
    <div className="flex gap-2 items-center justify-between">
      {Array.from({ length: passwordStrengthResult.id + 1 }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-1 rounded-sm transition-colors duration-300"
          style={{
            backgroundColor: passwordStates[passwordStrengthResult.id].color,
          }}
        ></div>
      ))}
      {Array.from({ length: 3 - passwordStrengthResult.id }).map((_, index) => (
        <div
          key={index}
          className="flex-1 bg-gray-300 h-1 rounded-sm transition-colors duration-300"
        ></div>
      ))}
      <div
        className="text-sm font-normal w-[62px] text-end"
        style={{
          color: passwordStates[passwordStrengthResult.id].color,
        }}
      >
        {passwordStates[passwordStrengthResult.id].label}
      </div>
    </div>
  );
}

export default PasswordStrengthChecker;
