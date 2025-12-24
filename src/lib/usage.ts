import { clerkClient } from "@clerk/nextjs/server";

const FREE_GENERATION_LIMIT = 3;

export async function getUsageCount(userId: string): Promise<number> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const count = (user.publicMetadata?.generationCount as number) || 0;
  return count;
}

export async function incrementUsage(userId: string): Promise<number> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const currentCount = (user.publicMetadata?.generationCount as number) || 0;
  const newCount = currentCount + 1;

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      generationCount: newCount,
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
