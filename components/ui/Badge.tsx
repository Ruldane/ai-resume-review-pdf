import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "critical" | "warning" | "good" | "neutral";
  size?: "sm" | "default";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", size = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full",
          "transition-colors duration-150",

          // Size variants
          size === "sm" && "px-2 py-0.5 text-xs",
          size === "default" && "px-2.5 py-1 text-xs",

          // Color variants
          variant === "critical" && [
            "bg-danger/15 text-danger border border-danger/30",
          ],
          variant === "warning" && [
            "bg-warning/15 text-warning border border-warning/30",
          ],
          variant === "good" && [
            "bg-success/15 text-success border border-success/30",
          ],
          variant === "neutral" && [
            "bg-bg-elevated text-text-secondary border border-border",
          ],

          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
