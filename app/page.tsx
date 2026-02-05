"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-6">
        {/* Card Demo */}
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>AI Resume Roaster</CardTitle>
            <CardDescription>
              Design system configured. Ready for development.
            </CardDescription>
          </CardHeader>
          <CardContent>
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

              {/* Badge variants */}
              <div>
                <h3 className="text-text-secondary text-sm mb-3">Badge Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="good">Good</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="critical">Critical</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-text-secondary text-sm mb-3">Badge Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm" variant="good">Small</Badge>
                  <Badge size="default" variant="good">Default</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button size="sm">Continue</Button>
          </CardFooter>
        </Card>

        {/* Glass Card Demo */}
        <Card glass className="max-w-lg w-full">
          <CardContent>
            <p className="text-text-secondary text-sm">
              This card has a glass-morphism effect with backdrop blur.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
