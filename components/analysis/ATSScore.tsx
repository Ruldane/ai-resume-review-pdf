"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export interface ATSAnalysis {
  score: number;
  missingKeywords?: string[];
  presentKeywords?: string[];
  suggestions?: string[];
}

export interface ATSScoreProps {
  analysis: ATSAnalysis;
  className?: string;
}

const ATSScore = forwardRef<HTMLDivElement, ATSScoreProps>(
  ({ analysis, className }, ref) => {
    const scoreColor =
      analysis.score >= 70
        ? "text-success"
        : analysis.score >= 50
          ? "text-warning"
          : "text-danger";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className={className}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="w-5 h-5 text-accent" />
                ATS Compatibility
              </CardTitle>
              <span className={cn("text-2xl font-bold", scoreColor)}>
                {analysis.score}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Present Keywords */}
            {analysis.presentKeywords && analysis.presentKeywords.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Keywords Found
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.presentKeywords.slice(0, 8).map((keyword, i) => (
                    <Badge key={i} variant="good" size="sm">
                      {keyword}
                    </Badge>
                  ))}
                  {analysis.presentKeywords.length > 8 && (
                    <Badge variant="neutral" size="sm">
                      +{analysis.presentKeywords.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-2">
                  <XCircle className="w-4 h-4 text-danger" />
                  Missing Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords.slice(0, 8).map((keyword, i) => (
                    <Badge key={i} variant="critical" size="sm">
                      {keyword}
                    </Badge>
                  ))}
                  {analysis.missingKeywords.length > 8 && (
                    <Badge variant="neutral" size="sm">
                      +{analysis.missingKeywords.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-2">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  Suggestions
                </div>
                <ul className="space-y-1.5">
                  {analysis.suggestions.slice(0, 3).map((suggestion, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="text-accent mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

ATSScore.displayName = "ATSScore";

export { ATSScore };
