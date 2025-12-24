"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Play, FileText, ArrowRight, Loader2, Check, User, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type InputMode = "empty" | "youtube" | "transcript";

interface VideoPreview {
  title: string;
  channel: string;
  videoId: string;
}

export function GenerateForm() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<InputMode>("empty");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // YouTube specific
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Transcript specific
  const [speakerName, setSpeakerName] = useState("");
  const [transcriptTitle, setTranscriptTitle] = useState("");

  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();

  // Detect input mode
  const detectMode = useCallback((value: string): InputMode => {
    if (!value.trim()) return "empty";

    // Check for YouTube URL patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of youtubePatterns) {
      if (pattern.test(value.trim())) {
        return "youtube";
      }
    }

    // If longer than 200 chars and not a URL, it's probably a transcript
    if (value.length > 200 && !value.startsWith("http")) {
      return "transcript";
    }

    // Still typing...
    return "empty";
  }, []);

  const extractVideoId = (value: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = value.trim().match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Fetch video preview when YouTube URL detected
  useEffect(() => {
    const videoId = extractVideoId(input);
    if (mode === "youtube" && videoId && !videoPreview) {
      setLoadingPreview(true);
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        .then(res => res.json())
        .then(data => {
          setVideoPreview({
            title: data.title || "Unknown Title",
            channel: data.author_name || "Unknown Channel",
            videoId,
          });
        })
        .catch(() => {
          setVideoPreview({
            title: "Video",
            channel: "YouTube",
            videoId,
          });
        })
        .finally(() => setLoadingPreview(false));
    }
  }, [mode, input, videoPreview]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setInput(value);
    setError("");

    const newMode = detectMode(value);

    // Reset video preview if mode changes
    if (newMode !== "youtube") {
      setVideoPreview(null);
    }

    setMode(newMode);
  };

  // Handle after sign in
  useEffect(() => {
    if (isSignedIn && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [isSignedIn, pendingAction]);

  const checkUsageAndProceed = async (action: () => void) => {
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
    action();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "empty") {
      setError("Please paste a YouTube URL or transcript");
      return;
    }

    // If not signed in, open sign-in modal
    if (isLoaded && !isSignedIn) {
      setPendingAction(() => () => handleSubmit(e));
      openSignIn();
      return;
    }

    setIsLoading(true);

    if (mode === "youtube") {
      const videoId = extractVideoId(input);
      if (!videoId) {
        setError("Invalid YouTube URL");
        setIsLoading(false);
        return;
      }

      await checkUsageAndProceed(() => {
        router.push(`/generate/${videoId}`);
      });
    } else if (mode === "transcript") {
      if (input.trim().length < 200) {
        setError("Transcript seems too short. Please paste more content.");
        setIsLoading(false);
        return;
      }

      await checkUsageAndProceed(() => {
        // Store transcript data in sessionStorage and navigate
        const transcriptData = {
          transcript: input.trim(),
          speakerName: speakerName.trim() || "Speaker",
          title: transcriptTitle.trim() || "Transcript",
        };
        sessionStorage.setItem("pendingTranscript", JSON.stringify(transcriptData));
        router.push("/generate/transcript");
      });
    }
  };

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <AnimatePresence mode="wait">
          {mode === "transcript" ? (
            // Transcript Mode - Expanded
            <motion.div
              key="transcript"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white rounded-2xl border-2 border-[var(--gold)] shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--gold)]/10 border-b border-[var(--gold)]/20">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--gold)]" />
                  <span className="font-sans font-medium text-[var(--navy)]">
                    Transcript detected
                  </span>
                  <span className="text-sm text-[var(--slate)]">
                    · {wordCount.toLocaleString()} words
                  </span>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>

              {/* Transcript Preview */}
              <div className="p-4">
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full h-32 p-3 rounded-xl border border-[var(--stone)] bg-[var(--cream)]/50 text-[var(--navy)] text-sm font-sans resize-none focus:outline-none focus:border-[var(--gold)] transition-colors"
                  placeholder="Your transcript..."
                />
              </div>

              {/* Speaker & Title Fields */}
              <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--slate)]" />
                  <input
                    type="text"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    placeholder="Speaker name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--stone)] bg-white text-[var(--navy)] placeholder:text-[var(--slate)]/50 font-sans text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--slate)]" />
                  <input
                    type="text"
                    value={transcriptTitle}
                    onChange={(e) => setTranscriptTitle(e.target.value)}
                    placeholder="Title (optional)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--stone)] bg-white text-[var(--navy)] placeholder:text-[var(--slate)]/50 font-sans text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="px-4 pb-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-gold px-6 py-4 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate Landing Page
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            // Default/YouTube Mode - Compact
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {mode === "youtube" ? (
                    <Play className="w-5 h-5 text-[var(--gold)]" />
                  ) : (
                    <FileText className="w-5 h-5 text-[var(--slate)]" />
                  )}
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Paste YouTube URL or transcript..."
                  className={`w-full pl-12 pr-40 py-5 rounded-2xl border-2 bg-white text-[var(--navy)] placeholder:text-[var(--slate)]/50 focus:outline-none transition-colors font-sans text-lg ${
                    mode === "youtube"
                      ? "border-[var(--gold)]"
                      : "border-[var(--stone)] focus:border-[var(--gold)]"
                  }`}
                  disabled={isLoading}
                />
                {mode === "youtube" && (
                  <div className="absolute right-36 top-1/2 -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading || mode === "empty"}
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

              {/* Video Preview */}
              <AnimatePresence>
                {mode === "youtube" && videoPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 p-3 bg-white rounded-xl border border-[var(--stone)] flex items-center gap-3"
                  >
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-[var(--navy)] flex-shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${videoPreview.videoId}/mqdefault.jpg`}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-[var(--navy)] text-sm truncate">
                        {videoPreview.title}
                      </p>
                      <p className="text-xs text-[var(--slate)]">
                        {videoPreview.channel}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading Preview */}
              {mode === "youtube" && loadingPreview && !videoPreview && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-[var(--stone)] flex items-center gap-3">
                  <div className="w-20 h-14 rounded-lg bg-[var(--stone)] animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--stone)] rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-3 bg-[var(--stone)] rounded animate-pulse w-1/2" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-red-500 text-sm font-sans text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {mode === "empty" && (
        <p className="mt-4 text-center text-sm text-[var(--slate)]">
          Works with YouTube videos, meeting transcripts, podcasts & more
        </p>
      )}
    </form>
  );
}
