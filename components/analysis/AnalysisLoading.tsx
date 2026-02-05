"use client";

import { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, FileSearch, BarChart3, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type AnalysisStep = "reading" | "scoring" | "generating" | "complete";

export interface AnalysisLoadingProps {
  currentStep?: AnalysisStep;
  className?: string;
}

interface Step {
  id: AnalysisStep;
  label: string;
  description: string;
  icon: typeof FileSearch;
}

const STEPS: Step[] = [
  {
    id: "reading",
    label: "Reading Content",
    description: "Analyzing your resume structure...",
    icon: FileSearch,
  },
  {
    id: "scoring",
    label: "Scoring Sections",
    description: "Evaluating each section...",
    icon: BarChart3,
  },
  {
    id: "generating",
    label: "Generating Improvements",
    description: "Crafting personalized rewrites...",
    icon: Sparkles,
  },
];

const AnalysisLoading = forwardRef<HTMLDivElement, AnalysisLoadingProps>(
  ({ currentStep = "reading", className }, ref) => {
    const [completedSteps, setCompletedSteps] = useState<Set<AnalysisStep>>(
      new Set()
    );

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

    useEffect(() => {
      // Mark previous steps as completed
      const newCompleted = new Set<AnalysisStep>();
      STEPS.forEach((step, index) => {
        if (index < currentStepIndex) {
          newCompleted.add(step.id);
        }
      });
      setCompletedSteps(newCompleted);
    }, [currentStep, currentStepIndex]);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "flex flex-col items-center justify-center py-16 px-4",
          className
        )}
      >
        {/* Animated Fire */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 40px rgba(99, 102, 241, 0.3)",
                "0 0 60px rgba(99, 102, 241, 0.5)",
                "0 0 40px rgba(99, 102, 241, 0.3)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full"
          />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Flame className="w-10 h-10 text-accent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-text-primary mb-2"
        >
          Analyzing your resume...
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-secondary mb-8"
        >
          This may take a moment
        </motion.p>

        {/* Steps */}
        <div className="w-full max-w-sm space-y-3">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = step.id === currentStep;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg transition-all duration-300",
                  isCurrent && "bg-accent/10 border border-accent/30",
                  isCompleted && "opacity-70",
                  !isCurrent && !isCompleted && "opacity-50"
                )}
              >
                {/* Icon/Check */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                    isCurrent && "bg-accent/20",
                    isCompleted && "bg-success/20",
                    !isCurrent && !isCompleted && "bg-bg-elevated"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check className="w-5 h-5 text-success" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        key="loading"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Icon className="w-5 h-5 text-accent" />
                      </motion.div>
                    ) : (
                      <Icon className="w-5 h-5 text-text-secondary" />
                    )}
                  </AnimatePresence>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium",
                      isCurrent && "text-text-primary",
                      isCompleted && "text-text-secondary",
                      !isCurrent && !isCompleted && "text-text-secondary"
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-text-secondary"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>

                {/* Progress indicator for current step */}
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-accent"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }
);

AnalysisLoading.displayName = "AnalysisLoading";

export { AnalysisLoading };
