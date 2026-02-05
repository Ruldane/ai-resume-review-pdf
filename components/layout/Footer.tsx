"use client";

import { forwardRef } from "react";
import { Flame, Github } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FooterProps {
  className?: string;
}

const Footer = forwardRef<HTMLElement, FooterProps>(({ className }, ref) => {
  return (
    <footer
      ref={ref}
      className={cn(
        "border-t border-border",
        "bg-bg-primary",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and tagline */}
          <div className="flex items-center gap-2 text-text-secondary">
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-sm">Built with AI</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export { Footer };
