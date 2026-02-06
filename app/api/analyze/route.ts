import { NextRequest } from "next/server";
import {
  RESUME_ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisPrompt,
  createStreamingRequest,
} from "@/lib/ai";

export interface AnalyzeRequest {
  resumeText: string;
  targetRole: string;
  company?: string;
}

// Handle unsupported methods
export async function GET() {
  return new Response(
    JSON.stringify({ error: "Method not allowed. Use POST to analyze a resume." }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        Allow: "POST, OPTIONS"
      }
    }
  );
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    // Validate required fields
    if (!body.resumeText || typeof body.resumeText !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Resume text is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!body.targetRole || typeof body.targetRole !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Target role is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Set up streaming response headers
    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let isClosed = false;

        // Helper to send SSE events safely
        const sendEvent = (event: string, data: unknown) => {
          if (isClosed) return;
          try {
            controller.enqueue(
              encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
            );
          } catch {
            isClosed = true;
          }
        };

        const closeController = () => {
          if (!isClosed) {
            isClosed = true;
            controller.close();
          }
        };

        try {
          // Send initial status
          sendEvent("status", { message: "Starting analysis..." });

          // Build the analysis prompt
          const userPrompt = buildAnalysisPrompt(
            body.resumeText,
            body.targetRole,
            body.company
          );

          sendEvent("status", { message: "Analyzing resume..." });

          // Make streaming request to AI API
          const aiResponse = await createStreamingRequest(
            RESUME_ANALYSIS_SYSTEM_PROMPT,
            userPrompt
          );

          if (!aiResponse.body) {
            throw new Error("No response body from AI API");
          }

          // Read and forward the streaming response
          const reader = aiResponse.body.getReader();
          const decoder = new TextDecoder();
          let fullContent = "";
          let buffer = ""; // Buffer for incomplete lines
          let debugRaw = ""; // For error logging

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            debugRaw += chunk;

            // Process complete lines (SSE events end with \n\n)
            const parts = buffer.split("\n");
            // Keep the last part in buffer (might be incomplete)
            buffer = parts.pop() || "";

            for (const line of parts) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);

                  // Handle Anthropic API streaming format
                  if (parsed.type === "content_block_delta") {
                    const text = parsed.delta?.text || "";
                    fullContent += text;
                    sendEvent("chunk", { text });
                  } else if (parsed.type === "message_stop") {
                    // Message complete
                  }
                  // Handle OpenAI-style streaming format (used by many API proxies)
                  else if (parsed.choices?.[0]?.delta?.content) {
                    const text = parsed.choices[0].delta.content;
                    fullContent += text;
                    sendEvent("chunk", { text });
                  }
                  // Handle direct content in non-streaming response
                  else if (parsed.content?.[0]?.text) {
                    const text = parsed.content[0].text;
                    fullContent += text;
                    sendEvent("chunk", { text });
                  }
                } catch {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
          }

          // Process any remaining buffer content
          if (buffer.startsWith("data: ")) {
            const data = buffer.slice(6);
            if (data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta") {
                  const text = parsed.delta?.text || "";
                  fullContent += text;
                  sendEvent("chunk", { text });
                }
              } catch {
                // Ignore
              }
            }
          }

          // Log if content is empty for debugging
          if (!fullContent) {
            console.error("AI response empty. Raw response:", debugRaw.slice(0, 500));
          }

          // Send the complete analysis
          sendEvent("status", { message: "Analysis complete" });

          // Try to parse the full content as JSON
          try {
            const analysis = JSON.parse(fullContent);
            sendEvent("result", analysis);
          } catch {
            // If JSON parsing fails, send as raw content
            sendEvent("result", { rawContent: fullContent });
          }

          sendEvent("complete", { success: true });
        } catch (error) {
          console.error("Analysis error:", error);
          sendEvent("error", {
            message:
              error instanceof Error ? error.message : "Analysis failed",
          });
        } finally {
          closeController();
        }
      },
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
