import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

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

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF using PDFParse class
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();

    return NextResponse.json({
      success: true,
      text: result.text,
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
