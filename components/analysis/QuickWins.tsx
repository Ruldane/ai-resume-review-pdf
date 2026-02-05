"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowUp, ArrowRight, ArrowDown, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type Impact = "high" | "medium" | "low";

export interface QuickWin {
  title: string;
  description: string;
  impact: Impact;
}

export interface QuickWinsProps {
  quickWins: QuickWin[];
  className?: string;
}

const IMPACT_CONFIG: Record<
  Impact,
  { icon: typeof ArrowUp; color: string; label: string }
> = {
  high: { icon: ArrowUp, color: "text-success", label: "High Impact" },
  medium: { icon: ArrowRight, color: "text-warning", label: "Medium Impact" },
  low: { icon: ArrowDown, color: "text-text-secondary", label: "Low Impact" },
};

const QuickWins = forwardRef<HTMLDivElement, QuickWinsProps>(
  ({ quickWins, className }, ref) => {
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    const toggleItem = (index: number) => {
      setCheckedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={className}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <CardTitle className="text-text-primary">Quick Wins</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <AnimatePresence>
                {quickWins.map((quickWin, index) => {
                  const isChecked = checkedItems.has(index);
                  const impactConfig = IMPACT_CONFIG[quickWin.impact];
                  const ImpactIcon = impactConfig.icon;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(index)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border transition-all duration-200",
                          "hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-primary",
                          isChecked
                            ? "border-success/30 bg-success/5"
                            : "border-border bg-bg-elevated/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div
                            className={cn(
                              "flex items-center justify-center w-5 h-5 rounded border-2 shrink-0 mt-0.5 transition-all duration-200",
                              isChecked
                                ? "bg-success border-success"
                                : "border-border bg-transparent"
                            )}
                          >
                            <motion.div
                              initial={false}
                              animate={{
                                scale: isChecked ? 1 : 0,
                                opacity: isChecked ? 1 : 0,
                              }}
                              transition={{ duration: 0.15 }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4
                              className={cn(
                                "font-medium mb-1 transition-all duration-200",
                                isChecked
                                  ? "text-text-secondary line-through"
                                  : "text-text-primary"
                              )}
                            >
                              {quickWin.title}
                            </h4>
                            <p
                              className={cn(
                                "text-sm mb-2 transition-all duration-200",
                                isChecked
                                  ? "text-text-secondary/70"
                                  : "text-text-secondary"
                              )}
                            >
                              {quickWin.description}
                            </p>
                            <div
                              className={cn(
                                "inline-flex items-center gap-1 text-xs font-medium transition-opacity duration-200",
                                impactConfig.color,
                                isChecked && "opacity-50"
                              )}
                            >
                              <ImpactIcon className="w-3 h-3" />
                              {impactConfig.label}
                            </div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

QuickWins.displayName = "QuickWins";

export { QuickWins };
