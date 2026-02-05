"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/analysis/ScoreRing";
import { VerdictBadge, type Verdict } from "@/components/analysis/VerdictBadge";
import { RoastSummary } from "@/components/analysis/RoastSummary";
import { QuickWins, type QuickWin } from "@/components/analysis/QuickWins";
import { AtsKeywords } from "@/components/analysis/AtsKeywords";
import { DiffContainer } from "@/components/diff/DiffContainer";
import { InlineDiff } from "@/components/diff/InlineDiff";
import { CopyAllButton } from "@/components/diff/CopyAllButton";
import { ImprovementNotes } from "@/components/diff/ImprovementNotes";
import { SectionNav } from "@/components/diff/SectionNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { downloadMarkdown } from "@/lib/export";
import type { AnalysisResponse, SectionAnalysis } from "@/lib/types";

// Map API verdict to component verdict
function mapVerdict(verdict: string): Verdict {
  switch (verdict) {
    case "brutal_honesty_needed":
      return "needs_work";
    case "needs_work":
      return "needs_work";
    case "solid_foundation":
      return "decent";
    case "exceptional":
      return "excellent";
    default:
      return "decent";
  }
}

// Map API quick wins to component format
function mapQuickWins(
  quickWins: AnalysisResponse["quick_wins"]
): QuickWin[] {
  return quickWins.map((qw) => ({
    title: qw.text,
    description: "",
    impact: qw.priority === "high" ? "high" : qw.priority === "medium" ? "medium" : "low",
  }));
}

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get analysis data from sessionStorage or URL hash
    const storedData = sessionStorage.getItem("analysisResult");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as AnalysisResponse;
        setAnalysis(parsed);
        if (parsed.sections.length > 0) {
          setActiveSection(parsed.sections[0].name);
        }
      } catch {
        // Invalid data, redirect back
        router.push("/");
      }
    } else {
      // Try to decode from URL hash
      const hash = window.location.hash.slice(1);
      if (hash) {
        try {
          const decoded = decodeURIComponent(atob(hash));
          const parsed = JSON.parse(decoded) as AnalysisResponse;
          setAnalysis(parsed);
          if (parsed.sections.length > 0) {
            setActiveSection(parsed.sections[0].name);
          }
        } catch {
          // Invalid data, redirect back
          router.push("/");
        }
      } else {
        // No data available, redirect back
        router.push("/");
      }
    }

    setIsLoading(false);
  }, [router]);

  const handleBack = () => {
    router.push("/");
  };

  const handleExport = () => {
    if (!analysis) return;
    downloadMarkdown(analysis);
  };

  const handleShare = () => {
    if (!analysis) return;
    // Share functionality will be added in US-064
    console.log("Share clicked");
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Scroll to section
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Flame className="w-8 h-8 text-accent" />
        </motion.div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const sectionNames = analysis.sections.map((s) => s.name);
  const sectionsForCopy = analysis.sections.map((s) => ({
    name: s.name,
    content: s.improved,
  }));

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Score */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center">
              <ScoreRing score={analysis.overall_score} size={180} />
              <VerdictBadge
                verdict={mapVerdict(analysis.overall_verdict)}
                className="mt-4"
              />
            </div>

            {/* Roast Summary */}
            <div className="lg:col-span-2">
              <RoastSummary summary={analysis.roast_summary} />
            </div>
          </div>
        </motion.section>

        {/* Quick Wins & ATS Keywords */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <QuickWins quickWins={mapQuickWins(analysis.quick_wins)} />
          <AtsKeywords keywords={analysis.ats_analysis.keywords_missing} />
        </motion.section>

        {/* Section Navigation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <SectionNav
              sections={sectionNames}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
            <CopyAllButton sections={sectionsForCopy} />
          </div>
        </motion.section>

        {/* Section Details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-6"
        >
          {analysis.sections.map((section, index) => (
            <Card
              key={section.name}
              id={`section-${section.name}`}
              className={cn(
                "scroll-mt-24 transition-all duration-300",
                activeSection === section.name && "ring-2 ring-accent/50"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                        section.severity === "critical" &&
                          "bg-danger/10 text-danger",
                        section.severity === "warning" &&
                          "bg-warning/10 text-warning",
                        section.severity === "good" &&
                          "bg-success/10 text-success"
                      )}
                    >
                      {section.score}
                    </span>
                    {section.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Diff View */}
                <DiffContainer
                  originalText={section.original}
                  improvedText={section.improved}
                  renderDiff={(original, improved) => (
                    <InlineDiff
                      original={original}
                      improved={improved}
                      animateOnView
                    />
                  )}
                />

                {/* Improvement Notes */}
                {section.improvement_notes && (
                  <ImprovementNotes notes={section.improvement_notes} />
                )}
              </CardContent>
            </Card>
          ))}
        </motion.section>
      </main>
    </div>
  );
}
