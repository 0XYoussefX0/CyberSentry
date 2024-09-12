"use client";

import CheckMark from "@/components/ui/CheckMark";

import { PasswordConstraints } from "@/lib/types";
import { Result } from "check-password-strength";

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

type PasswordContaintsCheckerProps = {
  passwordStrengthResult: Result<string>;
};

function PasswordContaintsChecker({
  passwordStrengthResult,
}: PasswordContaintsCheckerProps) {
  return (
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
  );
}

export default PasswordContaintsChecker;
