"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="bg-bg-card rounded-[var(--radius-card)] border border-border p-8 max-w-lg w-full">
          <h1 className="text-text-primary text-2xl font-bold mb-4">
            AI Resume Roaster
          </h1>
          <p className="text-text-secondary mb-6">
            Design system configured. Ready for development.
          </p>

          {/* Button variants demo */}
          <div className="space-y-6">
            <div>
              <h3 className="text-text-secondary text-sm mb-3">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            <div>
              <h3 className="text-text-secondary text-sm mb-3">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-text-secondary text-sm mb-3">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button isLoading={loading} onClick={handleLoadingDemo}>
                  {loading ? "Loading..." : "Click for Loading"}
                </Button>
              </div>
            </div>

            {/* Color swatches */}
            <div>
              <h3 className="text-text-secondary text-sm mb-3">Color Tokens</h3>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded bg-accent" title="Accent"></div>
                <div className="w-8 h-8 rounded bg-success" title="Success"></div>
                <div className="w-8 h-8 rounded bg-warning" title="Warning"></div>
                <div className="w-8 h-8 rounded bg-danger" title="Danger"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
