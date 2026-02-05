/**
 * Incremental JSON parser for streaming AI responses
 * Extracts data progressively as it becomes available
 */

export interface PartialAnalysis {
  overallScore?: number;
  verdict?: string;
  roastSummary?: string;
  sections?: Array<{
    name: string;
    score: number;
    severity: string;
    feedback: string;
    improvements?: string[];
  }>;
  atsAnalysis?: {
    score: number;
    missingKeywords?: string[];
    presentKeywords?: string[];
    suggestions?: string[];
  };
  quickWins?: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  rewrittenSummary?: string;
}

/**
 * Attempts to extract partial data from incomplete JSON
 * @param content - The accumulated content so far
 * @returns Partial analysis data that could be extracted
 */
export function extractPartialAnalysis(content: string): PartialAnalysis {
  const result: PartialAnalysis = {};

  // Try to extract overallScore
  const scoreMatch = content.match(/"overallScore"\s*:\s*(\d+)/);
  if (scoreMatch) {
    result.overallScore = parseInt(scoreMatch[1], 10);
  }

  // Try to extract verdict
  const verdictMatch = content.match(
    /"verdict"\s*:\s*"(needs_work|decent|strong|excellent)"/
  );
  if (verdictMatch) {
    result.verdict = verdictMatch[1];
  }

  // Try to extract roastSummary
  const summaryMatch = content.match(/"roastSummary"\s*:\s*"([^"]+)"/);
  if (summaryMatch) {
    result.roastSummary = summaryMatch[1].replace(/\\"/g, '"');
  }

  // Try to extract ATS score
  const atsScoreMatch = content.match(/"atsAnalysis"\s*:\s*\{\s*"score"\s*:\s*(\d+)/);
  if (atsScoreMatch) {
    result.atsAnalysis = {
      score: parseInt(atsScoreMatch[1], 10),
    };
  }

  return result;
}

/**
 * Parses complete JSON analysis, with fallback for malformed responses
 * @param content - The complete content string
 * @returns Parsed analysis or null if parsing fails
 */
export function parseCompleteAnalysis(content: string): PartialAnalysis | null {
  try {
    // First try to parse as-is
    return JSON.parse(content);
  } catch {
    // Try to find JSON object boundaries
    const startIndex = content.indexOf("{");
    const endIndex = content.lastIndexOf("}");

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      try {
        const jsonContent = content.slice(startIndex, endIndex + 1);
        return JSON.parse(jsonContent);
      } catch {
        // Fall through to partial extraction
      }
    }

    // Return partial extraction as fallback
    return extractPartialAnalysis(content);
  }
}

/**
 * Creates a streaming parser that accumulates content and emits partial results
 */
export function createStreamParser() {
  let content = "";
  let lastExtracted: PartialAnalysis = {};

  return {
    /**
     * Add a chunk to the accumulated content
     */
    addChunk(chunk: string): PartialAnalysis | null {
      content += chunk;

      // Extract partial data
      const extracted = extractPartialAnalysis(content);

      // Check if we have new data to emit
      const hasNewData =
        (extracted.overallScore !== undefined &&
          extracted.overallScore !== lastExtracted.overallScore) ||
        (extracted.verdict !== undefined &&
          extracted.verdict !== lastExtracted.verdict) ||
        (extracted.roastSummary !== undefined &&
          extracted.roastSummary !== lastExtracted.roastSummary);

      if (hasNewData) {
        lastExtracted = extracted;
        return extracted;
      }

      return null;
    },

    /**
     * Get the final parsed result
     */
    getResult(): PartialAnalysis | null {
      return parseCompleteAnalysis(content);
    },

    /**
     * Get the raw accumulated content
     */
    getContent(): string {
      return content;
    },
  };
}

/**
 * Parse a streaming SSE response from the analyze API
 */
export async function parseAnalysisStream(
  response: Response,
  onProgress?: (step: "score" | "sections" | "complete") => void
): Promise<AnalysisResponse | null> {
  const reader = response.body?.getReader();
  if (!reader) return null;

  const decoder = new TextDecoder();
  let result: AnalysisResponse | null = null;
  let currentEvent = "";
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE messages
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7);

          // Update progress based on event type
          if (currentEvent === "status" && onProgress) {
            onProgress("score");
          } else if (currentEvent === "chunk" && onProgress) {
            onProgress("sections");
          }
        } else if (line.startsWith("data: ")) {
          const data = line.slice(6);

          try {
            const parsed = JSON.parse(data);

            // Check if this is the final result event
            if (currentEvent === "result" && parsed.overall_score !== undefined) {
              result = parsed as AnalysisResponse;
              if (onProgress) {
                onProgress("complete");
              }
            }
          } catch {
            // Not valid JSON yet, continue
          }
        }
      }
    }

    return result;
  } finally {
    reader.releaseLock();
  }
}

import type { AnalysisResponse } from "./types";
