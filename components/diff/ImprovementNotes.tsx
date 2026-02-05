"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ImprovementNotesProps {
  notes: string;
  className?: string;
  defaultExpanded?: boolean;
}

const ImprovementNotes = forwardRef<HTMLDivElement, ImprovementNotesProps>(
  ({ notes, className, defaultExpanded = false }, ref) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    if (!notes) {
      return null;
    }

    return (
      <div ref={ref} className={className}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center gap-2 px-4 py-3 rounded-lg",
            "bg-accent/5 border border-accent/20",
            "text-left text-sm",
            "transition-all duration-200",
            "hover:bg-accent/10 hover:border-accent/30",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-primary"
          )}
        >
          <Info className="w-4 h-4 text-accent shrink-0" />
          <span className="flex-1 font-medium text-text-primary">
            Why these changes?
          </span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-3 mt-2 rounded-lg bg-bg-elevated/50 border border-border">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {notes}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ImprovementNotes.displayName = "ImprovementNotes";

export { ImprovementNotes };
