const COBALT_API_URL = "https://api.cobalt.tools/api/json";

export interface AudioExtractionResult {
  audioUrl: string;
  filename: string;
}

export async function extractAudio(videoId: string): Promise<AudioExtractionResult> {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const response = await fetch(COBALT_API_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: youtubeUrl,
      vCodec: "h264",
      vQuality: "720",
      aFormat: "mp3",
      isAudioOnly: true,
      isNoTTWatermark: true,
      isTTFullAudio: false,
      disableMetadata: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cobalt API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status === "error") {
    throw new Error(`Cobalt extraction failed: ${data.text || "Unknown error"}`);
  }

  if (data.status === "redirect" || data.status === "stream") {
    return {
      audioUrl: data.url,
      filename: data.filename || `${videoId}.mp3`,
    };
  }

  if (data.status === "picker") {
    // Multiple options available, pick the first audio one
    const audioOption = data.picker?.find((p: { type: string }) => p.type === "audio") || data.picker?.[0];
    if (audioOption?.url) {
      return {
        audioUrl: audioOption.url,
        filename: audioOption.filename || `${videoId}.mp3`,
      };
    }
  }

  throw new Error(`Unexpected Cobalt response: ${JSON.stringify(data)}`);
}

export async function downloadAudio(audioUrl: string): Promise<Buffer> {
  const response = await fetch(audioUrl);

  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
