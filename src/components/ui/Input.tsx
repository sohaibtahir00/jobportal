import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Visual variant of the input */
  variant?: "default" | "modern";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const hasError = Boolean(error);

    // Variant-specific styles
    const variantStyles = {
      default: {
        input: cn(
          "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-secondary-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError
            ? "border-danger-300 focus-visible:ring-danger-600"
            : "border-secondary-300 focus-visible:ring-primary-600"
        ),
        iconWrapper: "text-secondary-400",
        iconWrapperFocus: "",
      },
      modern: {
        input: cn(
          "flex h-12 w-full rounded-xl border bg-secondary-50/50 px-4 py-3 text-sm transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-secondary-400",
          "hover:bg-white hover:border-secondary-300",
          "focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-secondary-50/50",
          hasError
            ? "border-danger-300 focus:border-danger-400 focus:ring-danger-500/20"
            : "border-secondary-200"
        ),
        iconWrapper: "text-secondary-400 transition-colors duration-200",
        iconWrapperFocus: "group-focus-within:text-accent-500",
      },
    };

    const styles = variantStyles[variant];

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-secondary-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-danger-600">*</span>
            )}
          </label>
        )}

        <div className={cn("relative", variant === "modern" && "group")}>
          {leftIcon && (
            <div className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center",
              variant === "modern" ? "pl-4" : "pl-3",
              styles.iconWrapper,
              styles.iconWrapperFocus
            )}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              styles.input,
              leftIcon && (variant === "modern" ? "pl-12" : "pl-10"),
              rightIcon && (variant === "modern" ? "pr-12" : "pr-10"),
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className={cn(
              "pointer-events-none absolute inset-y-0 right-0 flex items-center",
              variant === "modern" ? "pr-4" : "pr-3",
              styles.iconWrapper,
              styles.iconWrapperFocus
            )}>
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-danger-600" : "text-secondary-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
