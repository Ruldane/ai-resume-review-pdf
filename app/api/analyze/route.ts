import { NextRequest } from "next/server";

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

          // TODO: Implement AI analysis in US-026/US-027
          // For now, send a placeholder response
          sendEvent("status", { message: "Analysis complete" });
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
