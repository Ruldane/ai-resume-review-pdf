"use client";

import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { getDetectedSectionNames, detectSections } from "@/lib/sectionDetection";

export interface TextPreviewProps {
  text: string;
  onConfirm?: () => void;
  onTryAnother?: () => void;
  className?: string;
  maxHeight?: string;
  showSections?: boolean;
}

const TextPreview = forwardRef<HTMLDivElement, TextPreviewProps>(
  (
    { text, onConfirm, onTryAnother, className, maxHeight = "300px", showSections = true },
    ref
  ) => {
    const detectedSections = useMemo(
      () => (showSections ? getDetectedSectionNames(text) : []),
      [text, showSections]
    );

    const sections = useMemo(
      () => (showSections ? detectSections(text) : []),
      [text, showSections]
    );

    // Highlight section headers in the text
    const highlightedText = useMemo(() => {
      if (!showSections || sections.length === 0) {
        return text;
      }

      const parts: { text: string; isHeader: boolean }[] = [];
      let lastEnd = 0;

      for (const section of sections) {
        // Add text before this section
        if (section.startIndex > lastEnd) {
          parts.push({
            text: text.slice(lastEnd, section.startIndex),
            isHeader: false,
          });
        }
        // Add the section header
        parts.push({
          text: text.slice(section.startIndex, section.endIndex),
          isHeader: true,
        });
        lastEnd = section.endIndex;
      }

      // Add remaining text
      if (lastEnd < text.length) {
        parts.push({
          text: text.slice(lastEnd),
          isHeader: false,
        });
      }

      return parts;
    }, [text, sections, showSections]);

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
          {/* Detected Sections Tags */}
          {showSections && detectedSections.length > 0 && (
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2">
                {detectedSections.map((section) => (
                  <Badge key={section} variant="neutral" size="sm">
                    {section}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          )}
          <CardContent className="p-0">
            {/* Scrollable Text Area */}
            <div
              className={cn(
                "overflow-y-auto p-4 font-mono text-sm text-text-secondary",
                "bg-bg-elevated/50",
                !showSections || detectedSections.length === 0
                  ? "rounded-t-[var(--radius-card)]"
                  : "",
                "whitespace-pre-wrap break-words leading-relaxed"
              )}
              style={{ maxHeight }}
            >
              {Array.isArray(highlightedText) ? (
                highlightedText.map((part, index) =>
                  part.isHeader ? (
                    <span
                      key={index}
                      className="text-accent font-semibold bg-accent/10 px-1 rounded"
                    >
                      {part.text}
                    </span>
                  ) : (
                    <span key={index}>{part.text}</span>
                  )
                )
              ) : (
                text || "No text extracted from the resume."
              )}
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
