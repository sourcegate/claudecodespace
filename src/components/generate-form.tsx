"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { Play, ArrowRight, Loader2 } from "lucide-react";

export function GenerateForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVideoId, setPendingVideoId] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  // Navigate to generate page after signing in
  useEffect(() => {
    if (isSignedIn && pendingVideoId) {
      setIsLoading(true);
      router.push(`/generate/${pendingVideoId}`);
      setPendingVideoId(null);
    }
  }, [isSignedIn, pendingVideoId, router]);

  const extractVideoId = (input: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError("Please enter a valid YouTube URL or video ID");
      return;
    }

    // If not signed in, open sign-in modal and save video ID for after auth
    if (isLoaded && !isSignedIn) {
      setPendingVideoId(videoId);
      openSignIn();
      return;
    }

    setIsLoading(true);

    // Check if user has generations remaining
    try {
      const usageRes = await fetch("/api/usage");
      if (usageRes.ok) {
        const usage = await usageRes.json();
        if (!usage.allowed) {
          setError("You've used all your free generations. Contact us to upgrade.");
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // If usage check fails, let them try anyway
    }

    router.push(`/generate/${videoId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Play className="w-5 h-5 text-[var(--slate)]" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL or video ID..."
          className="w-full pl-12 pr-40 py-5 rounded-2xl border-2 border-[var(--stone)] bg-white text-[var(--navy)] placeholder:text-[var(--slate)]/50 focus:outline-none focus:border-[var(--gold)] transition-colors font-sans text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold px-6 py-3 rounded-xl font-sans font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 spinner" />
              Processing
            </>
          ) : (
            <>
              Generate
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-red-500 text-sm font-sans">{error}</p>
      )}
    </form>
  );
}
