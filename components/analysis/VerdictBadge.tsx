"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type Verdict = "needs_work" | "decent" | "strong" | "excellent";

export interface VerdictBadgeProps {
  verdict: Verdict;
  className?: string;
}

const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; color: string; bg: string }
> = {
  needs_work: {
    label: "Needs Work",
    color: "text-danger",
    bg: "bg-danger/10",
  },
  decent: {
    label: "Decent",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  strong: {
    label: "Strong",
    color: "text-success",
    bg: "bg-success/10",
  },
  excellent: {
    label: "Excellent",
    color: "text-success",
    bg: "bg-success/20",
  },
};

const VerdictBadge = forwardRef<HTMLDivElement, VerdictBadgeProps>(
  ({ verdict, className }, ref) => {
    const config = VERDICT_CONFIG[verdict];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className={cn(
          "inline-flex items-center px-4 py-1.5 rounded-[var(--radius-pill)]",
          "text-sm font-semibold",
          config.bg,
          config.color,
          className
        )}
      >
        {config.label}
      </motion.div>
    );
  }
);

VerdictBadge.displayName = "VerdictBadge";

export { VerdictBadge };
