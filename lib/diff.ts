/**
 * Word-level diff algorithm for comparing original and improved text
 */

export type DiffType = "unchanged" | "added" | "removed";

export interface DiffSegment {
  type: DiffType;
  text: string;
}

/**
 * Tokenize text into words while preserving whitespace
 */
function tokenize(text: string): string[] {
  // Split on word boundaries, keeping whitespace attached to following word
  return text.split(/(?=\s+)|(?<=\s+)/).filter(Boolean);
}

/**
 * Compute the longest common subsequence between two arrays
 * Returns indices mapping from a to b
 */
function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  // Build LCS length table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find LCS pairs [index in a, index in b]
  const pairs: number[][] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      pairs.unshift([i - 1, j - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return pairs;
}

/**
 * Compute word-level diff between two text strings
 * Returns an array of diff segments
 */
export function computeDiff(original: string, improved: string): DiffSegment[] {
  // Handle edge cases
  if (!original && !improved) {
    return [];
  }

  if (!original) {
    return [{ type: "added", text: improved }];
  }

  if (!improved) {
    return [{ type: "removed", text: original }];
  }

  if (original === improved) {
    return [{ type: "unchanged", text: original }];
  }

  const originalTokens = tokenize(original);
  const improvedTokens = tokenize(improved);

  const lcs = computeLCS(originalTokens, improvedTokens);
  const segments: DiffSegment[] = [];

  let originalIdx = 0;
  let improvedIdx = 0;
  let lcsIdx = 0;

  while (originalIdx < originalTokens.length || improvedIdx < improvedTokens.length) {
    if (lcsIdx < lcs.length) {
      const [lcsOriginalIdx, lcsImprovedIdx] = lcs[lcsIdx];

      // Add removed tokens (in original but not in LCS)
      while (originalIdx < lcsOriginalIdx) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && lastSegment.type === "removed") {
          lastSegment.text += originalTokens[originalIdx];
        } else {
          segments.push({ type: "removed", text: originalTokens[originalIdx] });
        }
        originalIdx++;
      }

      // Add added tokens (in improved but not in LCS)
      while (improvedIdx < lcsImprovedIdx) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && lastSegment.type === "added") {
          lastSegment.text += improvedTokens[improvedIdx];
        } else {
          segments.push({ type: "added", text: improvedTokens[improvedIdx] });
        }
        improvedIdx++;
      }

      // Add unchanged token (in LCS)
      const lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.type === "unchanged") {
        lastSegment.text += originalTokens[originalIdx];
      } else {
        segments.push({ type: "unchanged", text: originalTokens[originalIdx] });
      }
      originalIdx++;
      improvedIdx++;
      lcsIdx++;
    } else {
      // Add remaining removed tokens
      while (originalIdx < originalTokens.length) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && lastSegment.type === "removed") {
          lastSegment.text += originalTokens[originalIdx];
        } else {
          segments.push({ type: "removed", text: originalTokens[originalIdx] });
        }
        originalIdx++;
      }

      // Add remaining added tokens
      while (improvedIdx < improvedTokens.length) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && lastSegment.type === "added") {
          lastSegment.text += improvedTokens[improvedIdx];
        } else {
          segments.push({ type: "added", text: improvedTokens[improvedIdx] });
        }
        improvedIdx++;
      }
    }
  }

  return segments;
}

/**
 * Compute a simplified diff for display purposes
 * Merges adjacent segments of the same type
 */
export function computeSimplifiedDiff(
  original: string,
  improved: string
): DiffSegment[] {
  const segments = computeDiff(original, improved);
  const simplified: DiffSegment[] = [];

  for (const segment of segments) {
    const last = simplified[simplified.length - 1];
    if (last && last.type === segment.type) {
      last.text += segment.text;
    } else {
      simplified.push({ ...segment });
    }
  }

  return simplified;
}
