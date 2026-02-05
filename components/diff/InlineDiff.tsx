"use client";

import { forwardRef, useMemo, useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { computeDiff, type DiffSegment } from "@/lib/diff";
import { cn } from "@/lib/cn";

export interface InlineDiffProps {
  original: string;
  improved: string;
  className?: string;
  animate?: boolean;
  staggerDelay?: number;
  animateOnView?: boolean;
}

const InlineDiff = forwardRef<HTMLDivElement, InlineDiffProps>(
  (
    {
      original,
      improved,
      className,
      animate = false,
      staggerDelay = 0.05,
      animateOnView = false,
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const isInView = useInView(combinedRef, { once: true, amount: 0.3 });
    const [hasAnimated, setHasAnimated] = useState(false);

    const shouldAnimate = animate || (animateOnView && isInView);

    useEffect(() => {
      if (isInView && animateOnView && !hasAnimated) {
        setHasAnimated(true);
      }
    }, [isInView, animateOnView, hasAnimated]);
    const segments = useMemo(
      () => computeDiff(original, improved),
      [original, improved]
    );

    const renderSegment = (segment: DiffSegment, index: number) => {
      const baseProps = shouldAnimate
        ? {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.2, delay: index * staggerDelay },
          }
        : {};

      switch (segment.type) {
        case "removed":
          return (
            <motion.span
              key={`removed-${index}`}
              {...baseProps}
              className={cn(
                "bg-danger/20 text-danger line-through",
                "px-0.5 rounded-sm"
              )}
            >
              {segment.text}
            </motion.span>
          );

        case "added":
          return (
            <motion.span
              key={`added-${index}`}
              {...baseProps}
              className={cn(
                "bg-success/20 text-success",
                "px-0.5 rounded-sm"
              )}
            >
              {segment.text}
            </motion.span>
          );

        case "unchanged":
        default:
          return shouldAnimate ? (
            <motion.span
              key={`unchanged-${index}`}
              {...baseProps}
              className="text-text-primary"
            >
              {segment.text}
            </motion.span>
          ) : (
            <span key={`unchanged-${index}`} className="text-text-primary">
              {segment.text}
            </span>
          );
      }
    };

    return (
      <div
        ref={combinedRef}
        className={cn(
          "whitespace-pre-wrap text-sm font-sans leading-relaxed",
          className
        )}
      >
        {segments.map((segment, index) => renderSegment(segment, index))}
      </div>
    );
  }
);

InlineDiff.displayName = "InlineDiff";

export { InlineDiff };
