// Using @distube/ytdl-core for direct YouTube audio extraction
// No external API dependencies - extracts directly from YouTube

import ytdl from "@distube/ytdl-core";

export interface AudioExtractionResult {
  audioBuffer: Buffer;
  filename: string;
}

export async function extractAudio(videoId: string): Promise<AudioExtractionResult> {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  console.log("Fetching video info for:", videoId);

  // Get video info to find audio formats
  const info = await ytdl.getInfo(videoUrl);
  const title = info.videoDetails.title || videoId;

  console.log("Video title:", title);

  // Filter to audio-only formats and sort by quality
  const audioFormats = ytdl.filterFormats(info.formats, "audioonly");

  if (audioFormats.length === 0) {
    throw new Error("No audio formats available for this video");
  }

  // Choose the best audio format (prefer m4a/mp4a for Whisper compatibility)
  const format = audioFormats.find(f => f.mimeType?.includes("mp4")) || audioFormats[0];

  console.log("Selected format:", format.mimeType, "bitrate:", format.audioBitrate);

  // Download audio as buffer
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    const stream = ytdl.downloadFromInfo(info, { format });

    stream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      const audioBuffer = Buffer.concat(chunks);
      console.log("Downloaded audio size:", audioBuffer.length, "bytes");

      // Use .m4a extension for mp4 audio, otherwise use format container
      const ext = format.container || "m4a";
      const filename = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`;

      resolve({
        audioBuffer,
        filename,
      });
    });

    stream.on("error", (error: Error) => {
      console.error("Stream error:", error);
      reject(new Error(`Failed to download audio: ${error.message}`));
    });
  });
}
