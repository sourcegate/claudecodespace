import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch transcript using youtube-transcript
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    // Combine all transcript segments into a single string
    const fullTranscript = transcriptItems
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    // Get video info from YouTube oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedResponse = await fetch(oembedUrl);

    let videoInfo = {
      title: "Unknown Title",
      channelTitle: "Unknown Speaker",
    };

    if (oembedResponse.ok) {
      const oembedData = await oembedResponse.json();
      videoInfo = {
        title: oembedData.title || "Unknown Title",
        channelTitle: oembedData.author_name || "Unknown Speaker",
      };
    }

    return NextResponse.json({
      videoId,
      title: videoInfo.title,
      channelTitle: videoInfo.channelTitle,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      transcript: fullTranscript,
      segments: transcriptItems,
    });
  } catch (error) {
    console.error("Transcript fetch error:", error);

    // Check if it's a transcript not available error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.includes("disabled") ||
      errorMessage.includes("not available")
    ) {
      return NextResponse.json(
        {
          error:
            "Transcripts are not available for this video. The video may have captions disabled.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch transcript. Please try another video." },
      { status: 500 }
    );
  }
}
