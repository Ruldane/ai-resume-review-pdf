"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type DiffPanelType = "original" | "improved";

export interface DiffPanelProps {
  type: DiffPanelType;
  title?: string;
  content: string;
  highlightedContent?: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

const DiffPanel = forwardRef<HTMLDivElement, DiffPanelProps>(
  (
    {
      type,
      title,
      content,
      highlightedContent,
      className,
      maxHeight = "500px",
    },
    ref
  ) => {
    const isOriginal = type === "original";
    const Icon = isOriginal ? FileText : Sparkles;
    const defaultTitle = isOriginal ? "Original" : "Improved";
    const displayTitle = title ?? defaultTitle;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("h-full", className)}
      >
        <Card className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border shrink-0">
            <div
              className={cn(
                "flex items-center gap-2",
                isOriginal ? "text-text-secondary" : "text-success"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{displayTitle}</span>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-4 flex-1 overflow-auto"
            style={{ maxHeight }}
          >
            {highlightedContent ? (
              <div className="text-sm leading-relaxed">
                {highlightedContent}
              </div>
            ) : (
              <pre
                className={cn(
                  "whitespace-pre-wrap text-sm font-sans leading-relaxed",
                  isOriginal ? "text-text-secondary" : "text-text-primary"
                )}
              >
                {content}
              </pre>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }
);

DiffPanel.displayName = "DiffPanel";

export { DiffPanel };
