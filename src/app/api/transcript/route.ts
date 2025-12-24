import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { extractAudio, downloadAudio } from "@/lib/audio-extractor";
import { transcribeAudio, isFileSizeValid } from "@/lib/whisper";

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

  // Try YouTube captions first
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
    console.log("YouTube captions not available, trying Whisper transcription...");
  }

  // Fallback to Whisper transcription
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Transcription service not configured. Please add OPENAI_API_KEY." },
        { status: 503 }
      );
    }

    // Extract audio from YouTube
    console.log("Extracting audio from YouTube...");
    const audioResult = await extractAudio(videoId);

    // Download the audio file
    console.log("Downloading audio...");
    const audioBuffer = await downloadAudio(audioResult.audioUrl);

    // Check file size (OpenAI limit is 25MB)
    if (!isFileSizeValid(audioBuffer)) {
      return NextResponse.json(
        { error: "Video audio is too large (>25MB). Please try a shorter video." },
        { status: 413 }
      );
    }

    // Transcribe with Whisper
    console.log("Transcribing with Whisper...");
    const transcription = await transcribeAudio(audioBuffer, audioResult.filename);

    // Convert Whisper segments to match YouTube format
    const segments = transcription.segments?.map((seg) => ({
      text: seg.text,
      offset: seg.start * 1000, // Convert to ms
      duration: (seg.end - seg.start) * 1000,
    })) || [];

    return NextResponse.json({
      videoId,
      title: videoInfo.title,
      channelTitle: videoInfo.channelTitle,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      transcript: transcription.text,
      segments,
      source: "whisper",
    });
  } catch (error) {
    console.error("Whisper transcription error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("Cobalt")) {
      return NextResponse.json(
        { error: "Unable to extract audio from this video. It may be restricted." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Failed to transcribe video. Please try another video." },
      { status: 500 }
    );
  }
}
