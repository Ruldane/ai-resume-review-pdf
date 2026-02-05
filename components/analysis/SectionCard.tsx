"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type Severity = "critical" | "warning" | "good";

export interface SectionAnalysis {
  name: string;
  score: number;
  severity: Severity;
  feedback: string;
  improvements?: string[];
}

export interface SectionCardProps {
  section: SectionAnalysis;
  className?: string;
  index?: number;
}

const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  ({ section, className, index = 0 }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const badgeVariant =
      section.severity === "critical"
        ? "critical"
        : section.severity === "warning"
          ? "warning"
          : "good";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={className}
      >
        <Card className="overflow-hidden">
          <CardHeader
            className={cn(
              "cursor-pointer transition-colors hover:bg-bg-elevated/50",
              "flex flex-row items-center justify-between py-3"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3">
              <Badge variant={badgeVariant} size="sm">
                {section.score}
              </Badge>
              <h3 className="font-medium text-text-primary">{section.name}</h3>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-text-secondary" />
            </motion.div>
          </CardHeader>

          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 pb-4 border-t border-border">
              <p className="text-text-secondary text-sm mb-4">
                {section.feedback}
              </p>

              {section.improvements && section.improvements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Improvements
                  </p>
                  <ul className="space-y-1.5">
                    {section.improvements.map((improvement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="text-accent mt-1">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    );
  }
);

SectionCard.displayName = "SectionCard";

export { SectionCard };
