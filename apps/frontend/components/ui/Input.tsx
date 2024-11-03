import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "bg-white border border-solid border-gray-300 rounded-lg py-2.5 px-3.5 leading-6 font-normal placeholder:text-gray-500",
  {
    variants: {
      variant: {
        default: "",
      },
      Size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      Size: "default",
    },
  },
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, Size, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, Size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
