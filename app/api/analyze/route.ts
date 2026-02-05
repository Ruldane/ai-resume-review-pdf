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

        // Helper to send SSE events
        const sendEvent = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
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

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  // Handle different event types from Anthropic API
                  if (parsed.type === "content_block_delta") {
                    const text = parsed.delta?.text || "";
                    fullContent += text;
                    sendEvent("chunk", { text });
                  } else if (parsed.type === "message_stop") {
                    // Message complete
                  }
                } catch {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
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
          controller.close();
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
