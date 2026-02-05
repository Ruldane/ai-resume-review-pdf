"use client";

import { forwardRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface AtsKeywordsProps {
  keywords: string[];
  className?: string;
}

const AtsKeywords = forwardRef<HTMLDivElement, AtsKeywordsProps>(
  ({ keywords, className }, ref) => {
    const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

    const copyToClipboard = useCallback(async (keyword: string) => {
      try {
        await navigator.clipboard.writeText(keyword);
        setCopiedKeyword(keyword);
        setTimeout(() => setCopiedKeyword(null), 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = keyword;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedKeyword(keyword);
        setTimeout(() => setCopiedKeyword(null), 2000);
      }
    }, []);

    if (!keywords || keywords.length === 0) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={className}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-text-primary">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Missing ATS Keywords
            </CardTitle>
            <p className="text-sm text-text-secondary mt-1">
              Add these keywords to improve your ATS score
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => {
                const isCopied = copiedKeyword === keyword;

                return (
                  <motion.div
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <button
                      type="button"
                      onClick={() => copyToClipboard(keyword)}
                      className={cn(
                        "group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
                        "bg-bg-elevated border border-border",
                        "text-text-secondary",
                        "transition-all duration-200",
                        "hover:border-accent/50 hover:bg-bg-elevated/80 hover:text-text-primary",
                        "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-primary",
                        isCopied && "border-success/50 bg-success/10 text-success"
                      )}
                      title={isCopied ? "Copied!" : "Click to copy"}
                    >
                      <span>{keyword}</span>
                      <AnimatePresence mode="wait">
                        {isCopied ? (
                          <motion.span
                            key="check"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check className="w-3.5 h-3.5 text-success" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 0.5, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.15 }}
                            className="group-hover:opacity-100"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AtsKeywords.displayName = "AtsKeywords";

export { AtsKeywords };
