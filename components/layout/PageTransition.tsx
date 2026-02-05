"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    );
  }
);

PageTransition.displayName = "PageTransition";

// Wrapper for AnimatePresence with page transitions
export interface PageTransitionWrapperProps {
  children: React.ReactNode;
  mode?: "wait" | "sync" | "popLayout";
}

const PageTransitionWrapper = ({ children, mode = "wait" }: PageTransitionWrapperProps) => {
  return (
    <AnimatePresence mode={mode}>
      {children}
    </AnimatePresence>
  );
};

export { PageTransition, PageTransitionWrapper };
