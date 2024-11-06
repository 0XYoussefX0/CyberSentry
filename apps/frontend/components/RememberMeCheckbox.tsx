"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Checkbox } from "react-aria-components";
import type { Noop } from "react-hook-form";

type RememeberMeCheckBoxProps = {
  onChange: (isSelected: boolean) => void;
  onBlur: Noop;
  value: boolean;
  disabled?: boolean;
  name: string;
};

const RememberMeCheckbox = forwardRef<
  HTMLLabelElement,
  RememeberMeCheckBoxProps
>(({ onChange, onBlur, value, disabled, name }, ref) => {
  return (
    <Checkbox
      onChange={onChange}
      isSelected={value}
      onBlur={onBlur}
      isDisabled={disabled}
      name={name}
      ref={ref}
      className="flex cursor-pointer items-center gap-2 font-medium text-gray-700 text-sm"
    >
      {({ isSelected }) => (
        <>
          <motion.div
            className={`${
              isSelected ? "border-brand-600 bg-brand-50" : "border-gray-300"
            } z-10 flex h-4 w-4 items-center justify-center rounded-[4px] border border-solid transition-colors hover:border-brand-600 hover:bg-brand-50 focus:border-brand-300 focus:outline focus:outline-4 focus:outline-brand-100 focus-visible:border-brand-300 focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand-100`}
          >
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="graphics-symbol"
            >
              <motion.path
                initial={{
                  pathLength: 0,
                  pathOffset: 1,
                  strokeOpacity: 0,
                }}
                animate={
                  isSelected
                    ? {
                        pathLength: 1,
                        pathOffset: 0,
                        strokeOpacity: 1,
                      }
                    : {
                        pathLength: 0,
                        pathOffset: 1,
                        strokeOpacity: 0,
                      }
                }
                d="M9 1L3.5 6.5L1 4"
                stroke="#7F56D9"
                strokeWidth="1.6666"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          Remember Me
        </>
      )}
    </Checkbox>
  );
});

RememberMeCheckbox.displayName = "RememberMeCheckbox";

export default RememberMeCheckbox;
