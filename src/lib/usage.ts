import { clerkClient } from "@clerk/nextjs/server";

const FREE_GENERATION_LIMIT = 3;

export interface GenerationRecord {
  id: string;
  timestamp: string;
  title: string;
  speaker: string;
  source: "youtube-captions" | "manual";
}

export async function getUsageCount(userId: string): Promise<number> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const count = (user.publicMetadata?.generationCount as number) || 0;
  return count;
}

export async function getGenerationHistory(userId: string): Promise<GenerationRecord[]> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata?.generations as GenerationRecord[]) || [];
}

export async function incrementUsage(
  userId: string,
  generation?: { id: string; title: string; speaker: string; source: "youtube-captions" | "manual" }
): Promise<number> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const currentCount = (user.publicMetadata?.generationCount as number) || 0;
  const newCount = currentCount + 1;

  // Get existing generations or initialize empty array
  const existingGenerations = (user.publicMetadata?.generations as GenerationRecord[]) || [];

  // Add new generation record (keep last 20 to avoid metadata size limits)
  const newGeneration: GenerationRecord | null = generation
    ? {
        id: generation.id,
        timestamp: new Date().toISOString(),
        title: generation.title,
        speaker: generation.speaker,
        source: generation.source,
      }
    : null;

  const updatedGenerations = newGeneration
    ? [...existingGenerations, newGeneration].slice(-20)
    : existingGenerations;

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      generationCount: newCount,
      generations: updatedGenerations,
    },
  });

  return newCount;
}

export async function canGenerate(userId: string): Promise<{ allowed: boolean; remaining: number; used: number }> {
  const used = await getUsageCount(userId);
  const remaining = Math.max(0, FREE_GENERATION_LIMIT - used);
  return {
    allowed: used < FREE_GENERATION_LIMIT,
    remaining,
    used,
  };
}

export function getLimit(): number {
  return FREE_GENERATION_LIMIT;
}
