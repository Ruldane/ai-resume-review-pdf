"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface TextPreviewProps {
  text: string;
  onConfirm?: () => void;
  onTryAnother?: () => void;
  className?: string;
  maxHeight?: string;
}

const TextPreview = forwardRef<HTMLDivElement, TextPreviewProps>(
  (
    { text, onConfirm, onTryAnother, className, maxHeight = "300px" },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <Card>
          <CardContent className="p-0">
            {/* Scrollable Text Area */}
            <div
              className={cn(
                "overflow-y-auto p-4 font-mono text-sm text-text-secondary",
                "bg-bg-elevated/50 rounded-t-[var(--radius-card)]",
                "whitespace-pre-wrap break-words leading-relaxed"
              )}
              style={{ maxHeight }}
            >
              {text || "No text extracted from the resume."}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onTryAnother}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try another
            </Button>
            <Button size="sm" onClick={onConfirm} className="gap-2">
              <Check className="w-4 h-4" />
              Looks good
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);

TextPreview.displayName = "TextPreview";

export { TextPreview };
