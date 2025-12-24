import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

async function getVideoInfo(videoId: string) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const oembedResponse = await fetch(oembedUrl);

  if (oembedResponse.ok) {
    const oembedData = await oembedResponse.json();
    return {
      title: oembedData.title || "Unknown Title",
      channelTitle: oembedData.author_name || "Unknown Speaker",
    };
  }

  return {
    title: "Unknown Title",
    channelTitle: "Unknown Speaker",
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  // Get video info first (works for all videos)
  const videoInfo = await getVideoInfo(videoId);

  // Try YouTube captions
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    const fullTranscript = transcriptItems
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return NextResponse.json({
      videoId,
      title: videoInfo.title,
      channelTitle: videoInfo.channelTitle,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      transcript: fullTranscript,
      segments: transcriptItems,
      source: "youtube-captions",
    });
  } catch (captionError) {
    console.log("YouTube captions not available for video:", videoId);

    // Return 404 to indicate transcript not available
    // Frontend will show manual input option
    return NextResponse.json(
      {
        error: "This video does not have captions available. Please paste the transcript manually.",
        videoInfo,
      },
      { status: 404 }
    );
  }
}
