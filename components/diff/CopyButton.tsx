"use client";

import { forwardRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: "default" | "ghost" | "inline";
  size?: "sm" | "md";
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ text, label, className, variant = "default", size = "sm" }, ref) => {
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        addToast({
          type: "success",
          message: "Copied to clipboard!",
          duration: 2000,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        addToast({
          type: "success",
          message: "Copied to clipboard!",
          duration: 2000,
        });
        setTimeout(() => setCopied(false), 2000);
      }
    }, [text, addToast]);

    if (variant === "inline") {
      return (
        <button
          ref={ref}
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm text-text-secondary",
            "hover:text-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-primary rounded",
            className
          )}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="text-success"
              >
                <Check className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
          {label && <span>{copied ? "Copied!" : label}</span>}
        </button>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant === "ghost" ? "ghost" : "secondary"}
        size={size}
        onClick={handleCopy}
        className={cn("gap-2", className)}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="text-success"
            >
              <Check className="w-4 h-4" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>
        {label ?? (copied ? "Copied!" : "Copy")}
      </Button>
    );
  }
);

CopyButton.displayName = "CopyButton";

export { CopyButton };
