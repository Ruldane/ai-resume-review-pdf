// Z AI API Configuration
// Using Anthropic-compatible API at https://api.z.ai

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

/**
 * Creates a streaming request to the Z AI API
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

  const response = await fetch(AI_CONFIG.baseUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  return response;
}

/**
 * Creates a non-streaming request to the Z AI API
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

  const response = await fetch(AI_CONFIG.baseUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
