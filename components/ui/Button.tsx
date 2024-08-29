import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils.client";
import { forwardRef } from "react";

const buttonVariants = cva(
  "font-semibold text-base leading-6 rounded-lg py-2.5 ",
  {
    variants: {
      variant: {
        default:
          "text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-80 active:scale-[0.96] active:bg-brand-700 transition-transform transition-colors relative fadding-border",
        secondary:
          "bg-white text-brand-700 border border-solid px-8 border-brand-300",
        link: "text-brand-600 underline",
      },
      size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
