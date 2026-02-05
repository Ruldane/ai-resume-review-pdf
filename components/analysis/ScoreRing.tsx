"use client";

import { forwardRef, useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
}

function getScoreColor(score: number): string {
  if (score <= 40) return "var(--danger)";
  if (score <= 70) return "var(--warning)";
  return "var(--success)";
}

function getScoreLabel(score: number): string {
  if (score <= 40) return "Needs significant improvement";
  if (score <= 70) return "Decent, but could be better";
  return "Great job";
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ score, size = 160, strokeWidth = 12, className, animate = true }, ref) => {
    const [mounted, setMounted] = useState(false);

    // Spring animation for the score value
    const springScore = useSpring(0, {
      stiffness: 50,
      damping: 20,
    });

    const displayScore = useTransform(springScore, (latest) =>
      Math.round(latest)
    );

    useEffect(() => {
      setMounted(true);
      if (animate) {
        springScore.set(score);
      } else {
        springScore.jump(score);
      }
    }, [score, springScore, animate]);

    // SVG calculations
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const scoreColor = getScoreColor(score);

    const scoreLabel = getScoreLabel(score);

    return (
      <div
        ref={ref}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Resume score: ${score} out of 100. ${scoreLabel}`}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        {/* Background ring */}
        <svg
          width={size}
          height={size}
          className="absolute transform -rotate-90"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={strokeWidth}
          />
        </svg>

        {/* Progress ring */}
        <motion.svg
          width={size}
          height={size}
          className="absolute transform -rotate-90"
          initial={false}
        >
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: mounted ? strokeDashoffset : circumference }}
            transition={{
              duration: animate ? 1.2 : 0,
              ease: "easeOut",
            }}
          />
        </motion.svg>

        {/* Score display */}
        <div className="relative flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold text-text-primary"
            style={{ color: scoreColor }}
          >
            {displayScore}
          </motion.span>
          <span className="text-sm text-text-secondary mt-1" aria-hidden="true">/ 100</span>
          <span className="sr-only">{scoreLabel}</span>
        </div>
      </div>
    );
  }
);

ScoreRing.displayName = "ScoreRing";

export { ScoreRing };
