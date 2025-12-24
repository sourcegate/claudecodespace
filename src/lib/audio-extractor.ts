// Using RapidAPI YouTube MP3 API for audio extraction
// Sign up at: https://rapidapi.com/

export interface AudioExtractionResult {
  audioUrl: string;
  filename: string;
}

export async function extractAudio(videoId: string): Promise<AudioExtractionResult> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (!rapidApiKey) {
    throw new Error("RAPIDAPI_KEY environment variable is not configured");
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Try the YouTube MP3 Download API
  const response = await fetch(
    `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("RapidAPI error response:", errorText);
    throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log("RapidAPI response:", JSON.stringify(data));

  if (data.status === "fail" || data.error) {
    throw new Error(`RapidAPI extraction failed: ${data.msg || data.error || "Unknown error"}`);
  }

  if (data.link) {
    return {
      audioUrl: data.link,
      filename: data.title ? `${data.title}.mp3` : `${videoId}.mp3`,
    };
  }

  throw new Error(`Unexpected RapidAPI response: ${JSON.stringify(data)}`);
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
