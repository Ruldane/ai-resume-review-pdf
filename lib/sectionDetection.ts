export interface DetectedSection {
  name: string;
  startIndex: number;
  endIndex: number;
}

const SECTION_PATTERNS: { name: string; patterns: RegExp[] }[] = [
  {
    name: "Summary",
    patterns: [
      /^(summary|professional summary|profile|about me|objective|career objective)[\s:]*$/im,
    ],
  },
  {
    name: "Experience",
    patterns: [
      /^(experience|work experience|employment|professional experience|work history)[\s:]*$/im,
    ],
  },
  {
    name: "Education",
    patterns: [
      /^(education|educational background|academic background|qualifications)[\s:]*$/im,
    ],
  },
  {
    name: "Skills",
    patterns: [
      /^(skills|technical skills|core competencies|competencies|expertise|technologies)[\s:]*$/im,
    ],
  },
  {
    name: "Projects",
    patterns: [
      /^(projects|personal projects|key projects|selected projects|portfolio)[\s:]*$/im,
    ],
  },
  {
    name: "Certifications",
    patterns: [
      /^(certifications|certificates|licenses|credentials)[\s:]*$/im,
    ],
  },
  {
    name: "Languages",
    patterns: [/^(languages|language skills)[\s:]*$/im],
  },
  {
    name: "Awards",
    patterns: [/^(awards|honors|achievements|accomplishments)[\s:]*$/im],
  },
];

export function detectSections(text: string): DetectedSection[] {
  const detectedSections: DetectedSection[] = [];
  const lines = text.split("\n");
  let currentIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineStart = currentIndex;
    const lineEnd = currentIndex + lines[i].length;

    for (const section of SECTION_PATTERNS) {
      for (const pattern of section.patterns) {
        if (pattern.test(line)) {
          // Check if we already detected this section type
          const existing = detectedSections.find((s) => s.name === section.name);
          if (!existing) {
            detectedSections.push({
              name: section.name,
              startIndex: lineStart,
              endIndex: lineEnd,
            });
          }
          break;
        }
      }
    }

    currentIndex += lines[i].length + 1; // +1 for newline
  }

  // Sort by position in document
  detectedSections.sort((a, b) => a.startIndex - b.startIndex);

  return detectedSections;
}

export function getDetectedSectionNames(text: string): string[] {
  const sections = detectSections(text);
  return sections.map((s) => s.name);
}
