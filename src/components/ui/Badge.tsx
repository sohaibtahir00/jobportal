import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center rounded-full font-semibold transition-colors";

    const variants = {
      primary: "bg-primary-100 text-primary-800 border-primary-200",
      secondary: "bg-secondary-100 text-secondary-800 border-secondary-200",
      success: "bg-success-100 text-success-800 border-success-200",
      warning: "bg-warning-100 text-warning-800 border-warning-200",
      danger: "bg-danger-100 text-danger-800 border-danger-200",
      outline:
        "border border-secondary-300 bg-transparent text-secondary-700",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
