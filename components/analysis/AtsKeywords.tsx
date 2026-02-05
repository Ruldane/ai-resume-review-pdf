"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface AtsKeywordsProps {
  keywords: string[];
  className?: string;
}

const AtsKeywords = forwardRef<HTMLDivElement, AtsKeywordsProps>(
  ({ keywords, className }, ref) => {
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
              {keywords.map((keyword, index) => (
                <motion.div
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm",
                      "bg-bg-elevated border border-border",
                      "text-text-secondary",
                      "transition-all duration-200",
                      "cursor-default"
                    )}
                  >
                    {keyword}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AtsKeywords.displayName = "AtsKeywords";

export { AtsKeywords };
