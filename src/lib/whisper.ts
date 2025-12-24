import OpenAI from "openai";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface TranscriptionResult {
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export async function transcribeAudio(audioBuffer: Buffer, filename: string): Promise<TranscriptionResult> {
  const openai = getOpenAIClient();

  // OpenAI expects a File object, convert Buffer to Uint8Array for compatibility
  const uint8Array = new Uint8Array(audioBuffer);
  const file = new File([uint8Array], filename, { type: "audio/mpeg" });

  const response = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
    response_format: "verbose_json",
  });

  return {
    text: response.text,
    segments: response.segments?.map((seg) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text,
    })),
  };
}

// Check if audio file is within OpenAI's 25MB limit
export function isFileSizeValid(buffer: Buffer): boolean {
  const MAX_SIZE = 25 * 1024 * 1024; // 25MB
  return buffer.length <= MAX_SIZE;
}
