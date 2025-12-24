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
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("GOOGLE_SHEETS_WEBHOOK_URL not configured, skipping log");
    console.log("Generation data:", JSON.stringify(data));
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
