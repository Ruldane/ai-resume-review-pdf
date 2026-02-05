"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  errors?: { file?: string; role?: string };
  className?: string;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ onClick, disabled, isLoading, errors = {}, className }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;
    const errorMessages = Object.values(errors).filter(Boolean);

    return (
      <div className={cn("relative inline-block", className)}>
        <div
          onMouseEnter={() => hasErrors && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Button
            ref={ref}
            variant="primary"
            size="lg"
            onClick={onClick}
            disabled={disabled || hasErrors}
            isLoading={isLoading}
            className="gap-2 w-full sm:w-auto"
          >
            <Flame className="w-5 h-5" />
            Roast My Resume
          </Button>
        </div>

        {/* Validation Tooltip */}
        <AnimatePresence>
          {showTooltip && hasErrors && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                "px-3 py-2 rounded-[var(--radius-card)]",
                "bg-bg-elevated border border-border shadow-lg",
                "text-sm text-text-secondary",
                "whitespace-nowrap z-50"
              )}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {errorMessages.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              </div>
              {/* Arrow */}
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2",
                  "border-8 border-transparent border-t-bg-elevated"
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
