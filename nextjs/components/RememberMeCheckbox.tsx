"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "react-aria-components";
import { Noop } from "react-hook-form";

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
      className="flex items-center gap-2  text-gray-700 font-medium text-sm cursor-pointer"
    >
      {({ isSelected }) => (
        <>
          <motion.div
            className={`${
              isSelected ? "bg-brand-50 border-brand-600" : "border-gray-300"
            } hover:bg-brand-50 hover:border-brand-600 focus-visible:border-brand-300 focus-visible:outline-4 focus-visible:outline-brand-100 focus-visible:outline focus:border-brand-300 focus:outline-4 focus:outline-brand-100 focus:outline transition-colors z-10 border border-solid w-4 h-4 rounded-[4px] flex items-center justify-center`}
          >
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
