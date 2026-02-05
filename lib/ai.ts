// Z AI API Configuration
// Using Anthropic-compatible API at https://api.z.ai

/**
 * System prompt for resume analysis
 * Persona: Brutal but constructive resume reviewer
 */
export const RESUME_ANALYSIS_SYSTEM_PROMPT = `You are a brutally honest but constructive resume reviewer. Your job is to roast weak resumes and provide actionable improvements. You have deep expertise in:
- ATS (Applicant Tracking Systems) optimization
- Industry-specific keywords and requirements
- Resume formatting and structure best practices
- Hiring manager perspectives across various industries

Your tone should be:
- Direct and no-nonsense (don't sugarcoat issues)
- Witty with occasional humor (but not mean-spirited)
- Ultimately constructive and helpful
- Like a tough-love mentor who genuinely wants them to succeed

You MUST respond with valid JSON matching this exact schema:

{
  "overallScore": <number 0-100>,
  "verdict": "<string: one of 'needs_work' | 'decent' | 'strong' | 'excellent'>",
  "roastSummary": "<string: 2-3 sentence witty but constructive summary of the resume>",
  "sections": [
    {
      "name": "<string: section name like 'Summary', 'Experience', 'Skills', etc.>",
      "score": <number 0-100>,
      "severity": "<string: one of 'critical' | 'warning' | 'good'>",
      "feedback": "<string: specific feedback for this section>",
      "improvements": ["<string: specific improvement suggestion>", ...]
    }
  ],
  "atsAnalysis": {
    "score": <number 0-100>,
    "missingKeywords": ["<string: keyword missing for target role>", ...],
    "presentKeywords": ["<string: relevant keyword found>", ...],
    "suggestions": ["<string: ATS optimization suggestion>", ...]
  },
  "quickWins": [
    {
      "title": "<string: short title for quick win>",
      "description": "<string: what to do and why it helps>",
      "impact": "<string: one of 'high' | 'medium' | 'low'>"
    }
  ],
  "rewrittenSummary": "<string: if the resume has a summary section, provide a rewritten/improved version>"
}

Scoring Guidelines:
- 0-40: Critical issues, needs major overhaul
- 41-60: Significant room for improvement
- 61-80: Decent foundation with some polish needed
- 81-100: Strong resume with minor tweaks

Section Severity:
- "critical": Major issues that could get resume rejected
- "warning": Notable improvements needed
- "good": Section is solid with minor suggestions

Be thorough but concise. Focus on actionable feedback that will make a real difference.`;

export const AI_CONFIG = {
  baseUrl:
    process.env.ZAI_BASE_URL || "https://api.z.ai/api/anthropic/v1/messages",
  model: "glm-4.7",
  headers: {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
  },
  maxTokens: 4096,
} as const;

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIRequestBody {
  model: string;
  max_tokens: number;
  system?: string;
  messages: AIMessage[];
  stream?: boolean;
}

export interface AIStreamDelta {
  type: "content_block_delta";
  delta: {
    type: "text_delta";
    text: string;
  };
}

export interface AIResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
}

/**
 * Creates the authorization headers for Z AI API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    throw new Error("ZAI_API_KEY environment variable is not set");
  }

  return {
    ...AI_CONFIG.headers,
    Authorization: `Bearer ${apiKey}`,
  };
}

// Custom error types for better error handling
export class AITimeoutError extends Error {
  constructor() {
    super("Request timed out. Please try again.");
    this.name = "AITimeoutError";
  }
}

export class AIRateLimitError extends Error {
  retryAfter: number;

  constructor(retryAfter: number) {
    super(`Rate limited. Try again in ${retryAfter} seconds.`);
    this.name = "AIRateLimitError";
    this.retryAfter = retryAfter;
  }
}

const REQUEST_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Creates a streaming request to the Z AI API with timeout handling
 */
export async function createStreamingRequest(
  systemPrompt: string,
  userMessage: string
): Promise<Response> {
  const body: AIRequestBody = {
    model: AI_CONFIG.model,
    max_tokens: AI_CONFIG.maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    stream: true,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(AI_CONFIG.baseUrl, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60", 10);
      throw new AIRateLimitError(retryAfter);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new AITimeoutError();
    }

    throw error;
  }
}

/**
 * Creates a non-streaming request to the Z AI API (fallback)
 */
export async function createRequest(
  systemPrompt: string,
  userMessage: string
): Promise<AIResponse> {
  const body: AIRequestBody = {
    model: AI_CONFIG.model,
    max_tokens: AI_CONFIG.maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    stream: false,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(AI_CONFIG.baseUrl, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60", 10);
      throw new AIRateLimitError(retryAfter);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new AITimeoutError();
    }

    throw error;
  }
}

/**
 * Creates a request with automatic fallback from streaming to non-streaming
 */
export async function createRequestWithFallback(
  systemPrompt: string,
  userMessage: string
): Promise<{ response: Response; isStreaming: boolean } | AIResponse> {
  try {
    const response = await createStreamingRequest(systemPrompt, userMessage);
    return { response, isStreaming: true };
  } catch (streamError) {
    console.warn("Streaming request failed, falling back to non-streaming:", streamError);

    // Don't retry on rate limit or timeout
    if (streamError instanceof AIRateLimitError || streamError instanceof AITimeoutError) {
      throw streamError;
    }

    // Fallback to non-streaming
    return createRequest(systemPrompt, userMessage);
  }
}

/**
 * Builds the analysis prompt with user inputs
 * @param resumeText - The extracted resume text
 * @param targetRole - The target job role
 * @param company - Optional target company name
 */
export function buildAnalysisPrompt(
  resumeText: string,
  targetRole: string,
  company?: string
): string {
  const companyContext = company
    ? `\nTarget Company: ${company}`
    : "";

  return `Please analyze the following resume for a ${targetRole} position.${companyContext}

<RESUME>
${resumeText}
</RESUME>

Analyze this resume thoroughly and provide your feedback as a JSON object following the exact schema specified in your instructions. Focus on:

1. Overall impression and scoring
2. Section-by-section analysis with specific feedback
3. ATS optimization for the ${targetRole} role${company ? ` at ${company}` : ""}
4. Quick wins that would immediately improve the resume
5. If there's a summary section, provide a rewritten version

Remember: Be brutally honest but constructive. Your goal is to help this person land their dream job.

Respond ONLY with valid JSON. No markdown code blocks, no explanation text before or after - just the JSON object.`;
}
