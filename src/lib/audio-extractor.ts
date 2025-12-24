// Using @ybd-project/ytdl-core for YouTube audio extraction
// Optimized for serverless with automatic poToken generation

import { YtdlCore } from "@ybd-project/ytdl-core/serverless";

export interface AudioExtractionResult {
  audioBuffer: Buffer;
  filename: string;
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  // Calculate total length
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return Buffer.from(result);
}

export async function extractAudio(videoId: string): Promise<AudioExtractionResult> {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  console.log("Initializing ytdl-core for serverless...");

  // Create ytdl instance - auto-generates poToken to avoid bot detection
  const ytdl = new YtdlCore({
    // poToken and visitorData are auto-generated if not specified
  });

  console.log("Fetching video info for:", videoId);

  // Get video info
  const info = await ytdl.getBasicInfo(videoUrl);
  const title = info.videoDetails.title || videoId;

  console.log("Video title:", title);
  console.log("Available formats:", info.formats.length);

  // Download as stream and convert to buffer
  console.log("Downloading audio...");
  const stream = await ytdl.download(videoUrl, {
    filter: "audioonly",
    quality: "highestaudio",
  });

  const buffer = await streamToBuffer(stream);
  console.log("Downloaded audio size:", buffer.length, "bytes");

  // Determine file extension
  const ext = "m4a";
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 100);
  const filename = `${safeTitle}.${ext}`;

  return {
    audioBuffer: buffer,
    filename,
  };
}
