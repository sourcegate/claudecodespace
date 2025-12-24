import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildExtractionPrompt } from "@/lib/prompt";
import { ExtractedContent } from "@/lib/types";
import { canGenerate, incrementUsage, getLimit } from "@/lib/usage";
import { logGeneration } from "@/lib/sheets-logger";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to generate landing pages" },
        { status: 401 }
      );
    }

    // Check usage limits
    const usage = await canGenerate(userId);
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: `You've used all ${getLimit()} free generations. Contact us to upgrade.`,
          usageExceeded: true
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { videoId, title, channelTitle, transcript, transcriptSource } = body;

    if (!videoId || !transcript) {
      return NextResponse.json(
        { error: "Video ID and transcript are required" },
        { status: 400 }
      );
    }

    // Get user email for logging
    let userEmail = "unknown";
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      userEmail = user.emailAddresses[0]?.emailAddress || "unknown";
    } catch {
      console.log("Could not fetch user email");
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

    // Increment usage count after successful generation
    await incrementUsage(userId);

    // Log generation to Google Sheets (non-blocking)
    logGeneration({
      timestamp: new Date().toISOString(),
      userEmail,
      userId,
      videoId,
      videoTitle: title || "Unknown",
      videoChannel: channelTitle || "Unknown",
      transcriptSource: transcriptSource || "youtube-captions",
    }).catch(console.error);

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
