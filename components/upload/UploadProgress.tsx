"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface UploadProgressProps {
  message?: string;
  className?: string;
}

const UploadProgress = forwardRef<HTMLDivElement, UploadProgressProps>(
  ({ message = "Parsing resume...", className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-12",
          "rounded-[var(--radius-card)] border-2 border-dashed border-accent/50",
          "bg-accent/5",
          className
        )}
      >
        {/* Spinning Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-accent" />
        </motion.div>

        {/* Progress Text */}
        <div className="text-center">
          <p className="font-medium text-text-primary">{message}</p>
          <p className="text-sm text-text-secondary mt-1">
            This may take a moment
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }
);

UploadProgress.displayName = "UploadProgress";

export { UploadProgress };
