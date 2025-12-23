import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildExtractionPrompt } from "@/lib/prompt";
import { ExtractedContent } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, title, channelTitle, transcript } = body;

    if (!videoId || !transcript) {
      return NextResponse.json(
        { error: "Video ID and transcript are required" },
        { status: 400 }
      );
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Build the extraction prompt
    const prompt = buildExtractionPrompt(
      channelTitle || "Unknown Speaker",
      title || "Unknown Talk",
      youtubeUrl,
      videoId,
      transcript
    );

    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the text content
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }

    // Parse the JSON response
    let extractedContent: ExtractedContent;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      extractedContent = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", textContent.text);
      throw new Error("Failed to parse AI response as JSON");
    }

    return NextResponse.json({
      success: true,
      content: extractedContent,
    });
  } catch (error) {
    console.error("Generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to generate content: ${errorMessage}` },
      { status: 500 }
    );
  }
}
