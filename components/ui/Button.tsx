"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center gap-2 font-semibold",
          "rounded-[var(--radius-pill)] transition-all duration-200 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",

          // Size variants
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-5 text-sm",
          size === "lg" && "h-12 px-6 text-base",

          // Variant styles
          variant === "primary" && [
            "bg-accent text-white",
            "hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25",
            "active:scale-[0.98] active:shadow-none",
          ],
          variant === "secondary" && [
            "bg-bg-elevated text-text-primary border border-border",
            "hover:bg-bg-card hover:border-accent/50",
            "active:scale-[0.98]",
          ],
          variant === "ghost" && [
            "bg-transparent text-text-secondary",
            "hover:bg-bg-elevated hover:text-text-primary",
            "active:scale-[0.98]",
          ],

          // Disabled state
          isDisabled && [
            "pointer-events-none opacity-50",
            "hover:shadow-none hover:scale-100",
          ],

          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Content - hidden when loading */}
        <span className={cn("flex items-center gap-2", isLoading && "invisible")}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
