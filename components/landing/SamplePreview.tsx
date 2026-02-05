"use client";

import { forwardRef, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { ScoreRing } from "@/components/analysis/ScoreRing";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

// Sample data for the preview
const SAMPLE_SCORE = 72;

const SAMPLE_SECTIONS = [
  { name: "Summary", score: 82, color: "var(--success)" },
  { name: "Experience", score: 78, color: "var(--success)" },
  { name: "Skills", score: 65, color: "var(--warning)" },
];

const BEFORE_TEXT = "Managed a team of developers";
const AFTER_TEXT = "Led and mentored a cross-functional team of 8 engineers, delivering 3 major product releases";

export interface SamplePreviewProps {
  className?: string;
}

const SamplePreview = forwardRef<HTMLDivElement, SamplePreviewProps>(
  ({ className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.2 });

    return (
      <section
        ref={ref}
        className={cn(
          "relative py-16 md:py-24 px-4",
          className
        )}
      >
        {/* Section header */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            See it in action
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Sample Analysis Preview
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Here's what you'll get: detailed scores, actionable feedback, and AI-powered rewrites
          </p>
        </motion.div>

        {/* Main preview content */}
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden border-border/50">
            <div className="p-6 md:p-10">
              {/* Top row: Score Ring + Section Bars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10">
                {/* Score Ring */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center justify-center"
                >
                  <p className="text-sm text-text-secondary uppercase tracking-wide mb-4">
                    Overall Score
                  </p>
                  <ScoreRing score={SAMPLE_SCORE} size={160} animate={isInView} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 1.4 }}
                    className="mt-4 px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium"
                  >
                    Solid Foundation
                  </motion.div>
                </motion.div>

                {/* Section Score Bars */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col justify-center"
                >
                  <p className="text-sm text-text-secondary uppercase tracking-wide mb-4">
                    Section Scores
                  </p>
                  <div className="space-y-4">
                    {SAMPLE_SECTIONS.map((section, index) => (
                      <motion.div
                        key={section.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-text-primary">
                            {section.name}
                          </span>
                          <span
                            className="text-sm font-bold"
                            style={{ color: section.color }}
                          >
                            {section.score}
                          </span>
                        </div>
                        <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${section.score}%` } : {}}
                            transition={{
                              duration: 0.8,
                              delay: 0.7 + index * 0.15,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: section.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10"
              />

              {/* Before/After Diff */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-accent" />
                  <p className="text-sm text-text-secondary uppercase tracking-wide">
                    AI-Powered Rewrite
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  {/* Before */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1.0 }}
                    className="p-4 rounded-lg bg-danger/5 border border-danger/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-danger uppercase tracking-wide">
                        Before
                      </span>
                    </div>
                    <p className="text-text-secondary line-through decoration-danger/50">
                      {BEFORE_TEXT}
                    </p>
                  </motion.div>

                  {/* Arrow */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.2 }}
                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>

                  {/* After */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1.3 }}
                    className="p-4 rounded-lg bg-success/5 border border-success/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-success uppercase tracking-wide">
                        After
                      </span>
                      <TrendingUp className="w-3.5 h-3.5 text-success" />
                    </div>
                    <p className="text-text-primary font-medium">
                      {AFTER_TEXT}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Bottom tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="text-center text-text-secondary/60 text-sm mt-8"
              >
                Analysis completes in seconds, not hours
              </motion.p>
            </div>
          </Card>
        </div>
      </section>
    );
  }
);

SamplePreview.displayName = "SamplePreview";

export { SamplePreview };
