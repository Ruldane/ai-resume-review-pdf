"use client";

import { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Sparkles, GitCompare } from "lucide-react";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface DiffContainerProps {
  originalText: string;
  improvedText: string;
  renderDiff?: (original: string, improved: string) => React.ReactNode;
  className?: string;
}

const DiffContainer = forwardRef<HTMLDivElement, DiffContainerProps>(
  ({ originalText, improvedText, renderDiff, className }, ref) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Desktop: Side-by-side view
    if (!isMobile) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={className}
        >
          <Tabs defaultValue="diff">
            <TabList className="mb-4">
              <Tab value="sidebyside">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Side by Side
                </span>
              </Tab>
              <Tab value="diff">
                <span className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4" />
                  Diff View
                </span>
              </Tab>
            </TabList>

            <TabPanel value="sidebyside">
              <div className="grid grid-cols-2 gap-4">
                {/* Original Panel */}
                <Card className="h-full">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Original</span>
                    </div>
                  </div>
                  <div className="p-4 max-h-[500px] overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm text-text-secondary font-sans leading-relaxed">
                      {originalText}
                    </pre>
                  </div>
                </Card>

                {/* Improved Panel */}
                <Card className="h-full">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 text-success">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Improved</span>
                    </div>
                  </div>
                  <div className="p-4 max-h-[500px] overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                      {improvedText}
                    </pre>
                  </div>
                </Card>
              </div>
            </TabPanel>

            <TabPanel value="diff">
              <Card>
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <GitCompare className="w-4 h-4" />
                    <span className="text-sm font-medium">Changes</span>
                    <div className="flex items-center gap-4 ml-4 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-danger/20 border border-danger/30" />
                        Removed
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-success/20 border border-success/30" />
                        Added
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 max-h-[500px] overflow-auto">
                  {renderDiff ? (
                    renderDiff(originalText, improvedText)
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                      {improvedText}
                    </pre>
                  )}
                </div>
              </Card>
            </TabPanel>
          </Tabs>
        </motion.div>
      );
    }

    // Mobile: Tabbed view
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={className}
      >
        <Tabs defaultValue="improved">
          <TabList className="mb-4">
            <Tab value="original">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Original
              </span>
            </Tab>
            <Tab value="improved">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Improved
              </span>
            </Tab>
            <Tab value="diff">
              <span className="flex items-center gap-2">
                <GitCompare className="w-4 h-4" />
                Diff
              </span>
            </Tab>
          </TabList>

          <AnimatePresence mode="wait">
            <TabPanel value="original">
              <Card>
                <div className="p-4 max-h-[400px] overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm text-text-secondary font-sans leading-relaxed">
                    {originalText}
                  </pre>
                </div>
              </Card>
            </TabPanel>

            <TabPanel value="improved">
              <Card>
                <div className="p-4 max-h-[400px] overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                    {improvedText}
                  </pre>
                </div>
              </Card>
            </TabPanel>

            <TabPanel value="diff">
              <Card>
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-danger/20 border border-danger/30" />
                      Removed
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-success/20 border border-success/30" />
                      Added
                    </span>
                  </div>
                </div>
                <div className="p-4 max-h-[400px] overflow-auto">
                  {renderDiff ? (
                    renderDiff(originalText, improvedText)
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                      {improvedText}
                    </pre>
                  )}
                </div>
              </Card>
            </TabPanel>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    );
  }
);

DiffContainer.displayName = "DiffContainer";

export { DiffContainer };
