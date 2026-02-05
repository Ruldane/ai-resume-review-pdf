"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface RoastSummaryProps {
  summary: string;
  className?: string;
}

const RoastSummary = forwardRef<HTMLDivElement, RoastSummaryProps>(
  ({ summary, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={className}
      >
        <Card className="bg-gradient-to-br from-bg-card to-bg-elevated border-accent/20">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 shrink-0">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-2">
                  The Roast
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

RoastSummary.displayName = "RoastSummary";

export { RoastSummary };
