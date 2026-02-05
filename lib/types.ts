/**
 * TypeScript interfaces for AI Resume Roaster
 */

// Severity levels for section scoring
export type Severity = "critical" | "warning" | "good";

// Individual section analysis
export interface SectionAnalysis {
  name: string;
  score: number; // 0-100
  severity: Severity;
  original: string;
  improved: string;
  improvement_notes: string;
}

// ATS keyword analysis
export interface AtsAnalysis {
  keywords_found: string[];
  keywords_missing: string[];
  score: number; // 0-100
}

// Quick win suggestion
export interface QuickWin {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
}

// Overall verdict levels
export type Verdict =
  | "brutal_honesty_needed"
  | "needs_work"
  | "solid_foundation"
  | "exceptional";

// Complete analysis response from AI
export interface AnalysisResponse {
  overall_score: number; // 0-100
  overall_verdict: Verdict;
  roast_summary: string;
  sections: SectionAnalysis[];
  ats_analysis: AtsAnalysis;
  quick_wins: QuickWin[];
}

// API request body for analysis
export interface AnalysisRequest {
  resumeText: string;
  targetRole: string;
  company?: string;
}

// PDF parse response
export interface ParseResponse {
  success: boolean;
  text?: string;
  error?: string;
}

// Form state for upload page
export interface UploadFormState {
  file: File | null;
  resumeText: string | null;
  targetRole: string | null;
  customRole: string | null;
  company: string | null;
  isLoading: boolean;
  error: string | null;
}

// Detected resume sections
export type ResumeSection =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "awards";

// Section detection result
export interface DetectedSection {
  type: ResumeSection;
  startIndex: number;
  endIndex: number;
  content: string;
}
