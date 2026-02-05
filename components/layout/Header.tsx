"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Flame, Github } from "lucide-react";
import { cn } from "@/lib/cn";

export interface HeaderProps {
  className?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(({ className }, ref) => {
  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-50",
        "bg-bg-primary/80 backdrop-blur-md",
        "border-b border-border",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-text-primary">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold text-lg">Resume Roaster</span>
          </a>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
                "text-sm text-text-secondary",
                "hover:text-text-primary hover:bg-bg-elevated",
                "transition-colors duration-200"
              )}
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
});

Header.displayName = "Header";

export { Header };
