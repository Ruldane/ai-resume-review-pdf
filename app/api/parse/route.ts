import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

// Vercel serverless function configuration
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Maximum execution time in seconds

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to upload a PDF file." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer and then Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Parse PDF using unpdf (serverless-friendly)
    let extractedText: string;

    try {
      // First, load the PDF into a document proxy
      const pdf = await getDocumentProxy(uint8Array);

      // Then extract text from all pages
      const { text } = await extractText(pdf, { mergePages: true });
      extractedText = text.trim();
    } catch (parseError) {
      console.error("PDF parse error:", parseError);
      console.error("Error name:", (parseError as Error).name);
      console.error("Error message:", (parseError as Error).message);
      console.error("Error stack:", (parseError as Error).stack);
      return NextResponse.json(
        { success: false, error: "Unable to read PDF. The file may be corrupted or password-protected." },
        { status: 422 }
      );
    }

    // Check for scanned/image PDFs (empty or minimal text)
    if (!extractedText || extractedText.length < 10) {
      return NextResponse.json(
        { success: false, error: "Scanned PDF not supported. Please upload a text-based PDF." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
