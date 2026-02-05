"use client";

import { forwardRef, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface SectionNavProps {
  sections: string[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

const SectionNav = forwardRef<HTMLDivElement, SectionNavProps>(
  ({ sections, activeSection, onSectionChange, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeButtonRef = useRef<HTMLButtonElement>(null);

    // Scroll active section into view
    useEffect(() => {
      if (activeButtonRef.current && containerRef.current) {
        const container = containerRef.current;
        const button = activeButtonRef.current;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Check if button is out of view
        if (buttonRect.left < containerRect.left) {
          container.scrollTo({
            left: container.scrollLeft + (buttonRect.left - containerRect.left) - 16,
            behavior: "smooth",
          });
        } else if (buttonRect.right > containerRect.right) {
          container.scrollTo({
            left: container.scrollLeft + (buttonRect.right - containerRect.right) + 16,
            behavior: "smooth",
          });
        }
      }
    }, [activeSection]);

    if (!sections || sections.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={cn("relative", className)}>
        {/* Gradient fade indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {sections.map((section) => {
            const isActive = section === activeSection;

            return (
              <button
                key={section}
                ref={isActive ? activeButtonRef : null}
                type="button"
                onClick={() => onSectionChange(section)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-primary",
                  isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sectionIndicator"
                    className="absolute inset-0 bg-accent/20 border border-accent/30 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{section}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

SectionNav.displayName = "SectionNav";

export { SectionNav };
