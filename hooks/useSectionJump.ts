"use client";

import { useCallback, useRef, useState } from "react";

export interface UseSectionJumpOptions {
  offset?: number;
  duration?: number;
  highlightDuration?: number;
}

export interface UseSectionJumpReturn {
  activeSection: string;
  setActiveSection: (section: string) => void;
  jumpToSection: (section: string) => void;
  highlightedSection: string | null;
  registerSection: (section: string, element: HTMLElement | null) => void;
}

export function useSectionJump(
  options: UseSectionJumpOptions = {}
): UseSectionJumpReturn {
  const { offset = 100, highlightDuration = 1500 } = options;

  const [activeSection, setActiveSection] = useState<string>("");
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  const registerSection = useCallback(
    (section: string, element: HTMLElement | null) => {
      if (element) {
        sectionRefs.current.set(section, element);
      } else {
        sectionRefs.current.delete(section);
      }
    },
    []
  );

  const jumpToSection = useCallback(
    (section: string) => {
      const element = sectionRefs.current.get(section);

      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });

        // Update active section
        setActiveSection(section);

        // Highlight briefly
        setHighlightedSection(section);
        setTimeout(() => {
          setHighlightedSection(null);
        }, highlightDuration);
      }
    },
    [offset, highlightDuration]
  );

  return {
    activeSection,
    setActiveSection,
    jumpToSection,
    highlightedSection,
    registerSection,
  };
}
