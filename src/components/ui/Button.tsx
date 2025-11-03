import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loading?: boolean; // Alias for isLoading
  loadingText?: string; // Custom loading text
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loading = false,
      loadingText,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Support both isLoading and loading props
    const isButtonLoading = isLoading || loading;
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600 active:bg-primary-800",
      secondary:
        "bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus-visible:ring-secondary-500 active:bg-secondary-400",
      outline:
        "border border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-600 active:bg-primary-100",
      ghost:
        "text-secondary-700 hover:bg-secondary-100 focus-visible:ring-secondary-500 active:bg-secondary-200",
      danger:
        "bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-600 active:bg-danger-800",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      isButtonLoading && "cursor-wait",
      className
    );

    if (asChild) {
      // When asChild is true, clone the child element and pass props to it
      const child = React.Children.only(children) as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        ...(props as object),
        className: cn(child.props.className, classes),
      });
    }

    // Determine loading text to display
    const displayLoadingText = loadingText || (
      typeof children === 'string' ? children : 'Loading...'
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isButtonLoading}
        {...props}
      >
        {isButtonLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{displayLoadingText}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
