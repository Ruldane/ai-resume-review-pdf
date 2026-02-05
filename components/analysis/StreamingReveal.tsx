"use client";

import { forwardRef, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export interface StreamingRevealProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
  chunkDelay?: number;
}

const StreamingReveal = forwardRef<HTMLDivElement, StreamingRevealProps>(
  ({ content, isStreaming = false, className, chunkDelay = 30 }, ref) => {
    const [displayedContent, setDisplayedContent] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const contentRef = useRef("");

    useEffect(() => {
      if (!isStreaming) {
        // If not streaming, show all content immediately
        setDisplayedContent(content);
        setIsComplete(true);
        return;
      }

      // Streaming mode - reveal content progressively
      if (content.length > contentRef.current.length) {
        const newContent = content.slice(contentRef.current.length);
        contentRef.current = content;

        // Reveal new characters with slight delay
        let charIndex = 0;
        const interval = setInterval(() => {
          if (charIndex < newContent.length) {
            setDisplayedContent(
              (prev) => prev + newContent[charIndex]
            );
            charIndex++;
          } else {
            clearInterval(interval);
          }
        }, chunkDelay);

        return () => clearInterval(interval);
      }
    }, [content, isStreaming, chunkDelay]);

    useEffect(() => {
      if (!isStreaming && content === displayedContent) {
        setIsComplete(true);
      }
    }, [isStreaming, content, displayedContent]);

    return (
      <div ref={ref} className={cn("relative", className)}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="whitespace-pre-wrap">{displayedContent}</span>
          {isStreaming && !isComplete && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-5 ml-1 bg-accent align-text-bottom"
            />
          )}
        </motion.div>
      </div>
    );
  }
);

StreamingReveal.displayName = "StreamingReveal";

// Score Reveal Component - animates score appearance
export interface ScoreRevealProps {
  score: number | null;
  isLoading?: boolean;
  className?: string;
}

const ScoreReveal = forwardRef<HTMLDivElement, ScoreRevealProps>(
  ({ score, isLoading = false, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <AnimatePresence mode="wait">
          {isLoading || score === null ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-8 h-8 rounded-full bg-bg-elevated"
              />
            </motion.div>
          ) : (
            <motion.div
              key="score"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="text-center"
            >
              <span className="text-4xl font-bold">{score}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ScoreReveal.displayName = "ScoreReveal";

// Section Reveal Component - for progressive section display
export interface SectionRevealProps {
  children: React.ReactNode;
  isVisible?: boolean;
  delay?: number;
  className?: string;
}

const SectionReveal = forwardRef<HTMLDivElement, SectionRevealProps>(
  ({ children, isVisible = true, delay = 0, className }, ref) => {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              delay,
              ease: "easeOut",
            }}
            className={className}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

SectionReveal.displayName = "SectionReveal";

export { StreamingReveal, ScoreReveal, SectionReveal };
