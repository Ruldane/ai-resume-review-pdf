"use client";

import { forwardRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ScoreRing } from "@/components/analysis/ScoreRing";
import { VerdictBadge } from "@/components/analysis/VerdictBadge";
import { SectionCard } from "@/components/analysis/SectionCard";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const SAMPLE_DATA = {
  score: 72,
  verdict: "strong" as const,
  sections: [
    {
      name: "Experience",
      score: 85,
      severity: "good" as const,
      feedback: "Strong impact statements with quantified achievements.",
      improvements: ["Add more metrics to demonstrate impact"],
    },
    {
      name: "Skills",
      score: 68,
      severity: "warning" as const,
      feedback: "Missing key technical skills for the target role.",
      improvements: ["Add TypeScript", "Include cloud platforms"],
    },
    {
      name: "Summary",
      score: 55,
      severity: "critical" as const,
      feedback: "Too generic. Needs to highlight unique value proposition.",
      improvements: ["Tailor to specific role", "Add key achievements"],
    },
  ],
};

export interface SamplePreviewProps {
  className?: string;
}

const SamplePreview = forwardRef<HTMLDivElement, SamplePreviewProps>(
  ({ className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });

    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
        className={cn("w-full max-w-4xl mx-auto", className)}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-sm text-text-secondary uppercase tracking-wide mb-2">
                Sample Analysis
              </p>
              <h3 className="text-xl font-semibold text-text-primary">
                See what you'll get
              </h3>
            </div>

            {/* Score and Verdict */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <ScoreRing
                  score={SAMPLE_DATA.score}
                  size={140}
                  animate={isInView}
                />
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <VerdictBadge verdict={SAMPLE_DATA.verdict} />
              </motion.div>
            </div>

            {/* Section Cards */}
            <div className="space-y-4">
              {SAMPLE_DATA.sections.map((section, index) => (
                <motion.div
                  key={section.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  <SectionCard section={section} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

SamplePreview.displayName = "SamplePreview";

export { SamplePreview };
