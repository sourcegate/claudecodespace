// Simple Google Sheets logger via Google Apps Script webhook
// No API keys needed - just deploy a script and add the URL to env vars

export interface GenerationLog {
  timestamp: string;
  userEmail: string;
  userId: string;
  videoId: string;
  videoTitle: string;
  videoChannel: string;
  transcriptSource: "youtube-captions" | "manual";
  transcript: string;
  result: string;
}

export async function logGeneration(data: GenerationLog): Promise<void> {
  // Always log to Vercel logs as backup (without huge transcript/result)
  const logSummary = {
    timestamp: data.timestamp,
    userEmail: data.userEmail,
    userId: data.userId,
    videoId: data.videoId,
    videoTitle: data.videoTitle,
    videoChannel: data.videoChannel,
    transcriptSource: data.transcriptSource,
    transcriptLength: data.transcript?.length || 0,
    resultLength: data.result?.length || 0,
  };
  console.log("[GENERATION]", JSON.stringify(logSummary));

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("GOOGLE_SHEETS_WEBHOOK_URL not configured, skipping Sheets log");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Failed to log to Google Sheets:", response.status);
    } else {
      console.log("Logged generation to Google Sheets");
    }
  } catch (error) {
    // Don't fail the request if logging fails
    console.error("Error logging to Google Sheets:", error);
  }
}
