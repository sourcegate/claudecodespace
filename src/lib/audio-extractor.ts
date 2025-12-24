// Using RapidAPI YouTube MP3 API for audio extraction
// Sign up at: https://rapidapi.com/

export interface AudioExtractionResult {
  audioUrl: string;
  filename: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function extractAudio(videoId: string): Promise<AudioExtractionResult> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (!rapidApiKey) {
    throw new Error("RAPIDAPI_KEY environment variable is not configured");
  }

  const maxAttempts = 30; // Max 30 attempts (about 60 seconds)
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`RapidAPI attempt ${attempts}/${maxAttempts}`);

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

    // If still processing, wait and retry
    if (data.status === "processing") {
      console.log(`Still processing (${data.progress || 0}%), waiting 2 seconds...`);
      await sleep(2000);
      continue;
    }

    // Success - got the link
    if (data.status === "ok" && data.link) {
      return {
        audioUrl: data.link,
        filename: data.title ? `${data.title}.mp3` : `${videoId}.mp3`,
      };
    }

    // Unknown status
    throw new Error(`Unexpected RapidAPI response: ${JSON.stringify(data)}`);
  }

  throw new Error("RapidAPI processing timeout - please try again");
}

export async function downloadAudio(audioUrl: string): Promise<Buffer> {
  console.log("Downloading audio from:", audioUrl);

  // Try with full browser-like headers
  const response = await fetch(audioUrl, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "audio/mpeg, audio/*, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.youtube.com/",
      "Origin": "https://www.youtube.com",
    },
    redirect: "follow",
  });

  console.log("Download response status:", response.status);

  if (!response.ok) {
    // If 404, the link may have expired - log more details
    console.error("Download failed:", response.status, response.statusText);
    console.error("Response headers:", Object.fromEntries(response.headers.entries()));
    throw new Error(`Failed to download audio: ${response.status} - Link may have expired`);
  }

  const arrayBuffer = await response.arrayBuffer();
  console.log("Downloaded audio size:", arrayBuffer.byteLength, "bytes");
  return Buffer.from(arrayBuffer);
}
