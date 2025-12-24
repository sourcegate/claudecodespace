import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { canGenerate, getLimit } from "@/lib/usage";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const usage = await canGenerate(userId);

    return NextResponse.json({
      allowed: usage.allowed,
      remaining: usage.remaining,
      used: usage.used,
      limit: getLimit(),
    });
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json(
      { error: "Failed to check usage" },
      { status: 500 }
    );
  }
}
