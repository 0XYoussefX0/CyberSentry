import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const labelVariants = cva("font-medium text-sm leading-5 text-gray-700", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, variant, size, ...props }, ref) => {
    return (
      <label
        className={cn(labelVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label, labelVariants };
