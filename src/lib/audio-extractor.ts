// Using cobalt.tools API for audio extraction
// API docs: https://github.com/imputnet/cobalt/blob/main/docs/api.md

const COBALT_API_URL = "https://api.cobalt.tools/";

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
      downloadMode: "audio",
      audioFormat: "mp3",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cobalt API error response:", errorText);
    throw new Error(`Cobalt API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Cobalt API response:", JSON.stringify(data));

  if (data.status === "error") {
    throw new Error(`Cobalt extraction failed: ${data.error?.code || data.text || "Unknown error"}`);
  }

  // Handle tunnel response (Cobalt proxies the file)
  if (data.status === "tunnel" || data.status === "redirect") {
    return {
      audioUrl: data.url,
      filename: data.filename || `${videoId}.mp3`,
    };
  }

  // Handle stream response
  if (data.status === "stream") {
    return {
      audioUrl: data.url,
      filename: data.filename || `${videoId}.mp3`,
    };
  }

  // Handle picker response (multiple options)
  if (data.status === "picker" && data.picker?.length > 0) {
    const audioOption = data.picker.find((p: { type?: string }) => p.type === "audio") || data.picker[0];
    if (audioOption?.url) {
      return {
        audioUrl: audioOption.url,
        filename: audioOption.filename || `${videoId}.mp3`,
      };
    }
  }

  throw new Error(`Unexpected Cobalt response status: ${data.status}`);
}

export async function downloadAudio(audioUrl: string): Promise<Buffer> {
  const response = await fetch(audioUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
