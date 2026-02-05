"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type Impact = "high" | "medium" | "low";

export interface QuickWin {
  title: string;
  description: string;
  impact: Impact;
}

export interface QuickWinCardProps {
  quickWin: QuickWin;
  className?: string;
  index?: number;
}

const IMPACT_CONFIG: Record<
  Impact,
  { icon: typeof ArrowUp; color: string; label: string }
> = {
  high: { icon: ArrowUp, color: "text-success", label: "High Impact" },
  medium: { icon: ArrowRight, color: "text-warning", label: "Medium Impact" },
  low: { icon: ArrowDown, color: "text-text-secondary", label: "Low Impact" },
};

const QuickWinCard = forwardRef<HTMLDivElement, QuickWinCardProps>(
  ({ quickWin, className, index = 0 }, ref) => {
    const impactConfig = IMPACT_CONFIG[quickWin.impact];
    const ImpactIcon = impactConfig.icon;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={className}
      >
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 shrink-0">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text-primary mb-1">
                  {quickWin.title}
                </h4>
                <p className="text-sm text-text-secondary mb-2">
                  {quickWin.description}
                </p>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    impactConfig.color
                  )}
                >
                  <ImpactIcon className="w-3 h-3" />
                  {impactConfig.label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

QuickWinCard.displayName = "QuickWinCard";

export { QuickWinCard };
