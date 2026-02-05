"use client";

import { forwardRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export interface Section {
  name: string;
  content: string;
}

export interface CopyAllButtonProps {
  sections: Section[];
  className?: string;
}

const CopyAllButton = forwardRef<HTMLButtonElement, CopyAllButtonProps>(
  ({ sections, className }, ref) => {
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();

    const formatAllSections = useCallback(() => {
      return sections
        .map((section) => `## ${section.name}\n\n${section.content}`)
        .join("\n\n---\n\n");
    }, [sections]);

    const handleCopy = useCallback(async () => {
      const text = formatAllSections();

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        addToast({
          type: "success",
          message: `Copied ${sections.length} sections to clipboard!`,
          duration: 3000,
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
          message: `Copied ${sections.length} sections to clipboard!`,
          duration: 3000,
        });
        setTimeout(() => setCopied(false), 2000);
      }
    }, [formatAllSections, sections.length, addToast]);

    return (
      <Button
        ref={ref}
        variant="primary"
        size="md"
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
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Copied All!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Copy All Improvements
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    );
  }
);

CopyAllButton.displayName = "CopyAllButton";

export { CopyAllButton };
