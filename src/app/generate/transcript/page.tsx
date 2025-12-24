"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Brain,
  Palette,
} from "lucide-react";
import { ExtractedContent, GenerationStatus } from "@/lib/types";

const steps = [
  {
    id: "processing",
    label: "Processing transcript",
    icon: FileText,
  },
  {
    id: "extracting",
    label: "Extracting intellectual property",
    icon: Brain,
  },
  {
    id: "generating",
    label: "Generating landing page",
    icon: Palette,
  },
];

export default function TranscriptGeneratePage() {
  const router = useRouter();

  const [status, setStatus] = useState<GenerationStatus>({
    step: "processing",
    message: "Starting...",
    progress: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [transcriptInfo, setTranscriptInfo] = useState<{
    title: string;
    speakerName: string;
    wordCount: number;
  } | null>(null);

  const processTranscript = useCallback(async () => {
    try {
      // Get transcript data from sessionStorage
      const storedData = sessionStorage.getItem("pendingTranscript");
      if (!storedData) {
        setError("No transcript found. Please go back and paste your transcript.");
        return;
      }

      const { transcript, speakerName, title } = JSON.parse(storedData);
      const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

      setTranscriptInfo({
        title,
        speakerName,
        wordCount,
      });

      setStatus({
        step: "processing",
        message: "Analyzing your transcript...",
        progress: 10,
      });

      // Clear the stored data
      sessionStorage.removeItem("pendingTranscript");

      // Generate a unique ID for this transcript
      const transcriptId = `t_${Date.now().toString(36)}`;

      // Step 2: Extract content with AI
      setStatus({
        step: "extracting",
        message: "AI is analyzing your content and extracting frameworks...",
        progress: 30,
      });

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: transcriptId,
          title,
          channelTitle: speakerName,
          transcript,
          transcriptSource: "manual",
        }),
      });

      if (!generateRes.ok) {
        const errorData = await generateRes.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      const generateData = await generateRes.json();
      const content: ExtractedContent = generateData.content;

      setStatus({
        step: "generating",
        message: "Building your premium landing page...",
        progress: 80,
      });

      // Store the content in sessionStorage for the preview page
      sessionStorage.setItem(
        `landing-${transcriptId}`,
        JSON.stringify(content)
      );

      setStatus({
        step: "complete",
        message: "Your landing page is ready!",
        progress: 100,
      });

      // Navigate to preview after a brief delay
      setTimeout(() => {
        router.push(`/preview/${transcriptId}`);
      }, 1500);
    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus({
        step: "error",
        message: "Something went wrong",
        progress: 0,
      });
    }
  }, [router]);

  useEffect(() => {
    processTranscript();
  }, [processTranscript]);

  const currentStepIndex = steps.findIndex((s) => s.id === status.step);

  return (
    <main className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Transcript Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8"
        >
          <div className="p-6 bg-gradient-to-br from-[var(--navy)] to-[var(--navy)]/90">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <div>
                {transcriptInfo ? (
                  <>
                    <p className="text-white/70 text-sm font-sans mb-1">
                      {transcriptInfo.speakerName}
                    </p>
                    <h2 className="text-white font-sans font-semibold text-lg">
                      {transcriptInfo.title}
                    </h2>
                    <p className="text-white/50 text-sm mt-1">
                      {transcriptInfo.wordCount.toLocaleString()} words
                    </p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="h-4 bg-white/20 rounded w-24 animate-pulse" />
                    <div className="h-6 bg-white/20 rounded w-48 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          {/* Error State */}
          {error ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-sans font-semibold text-[var(--navy)] mb-2">
                Something went wrong
              </h3>
              <p className="text-[var(--slate)] mb-6">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="btn-primary px-6 py-3 rounded-xl font-sans font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Steps */}
              <div className="space-y-4 mb-8">
                {steps.map((step, index) => {
                  const isComplete =
                    status.step === "complete" || index < currentStepIndex;
                  const isCurrent = step.id === status.step;
                  const isPending = index > currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                        isCurrent
                          ? "bg-[var(--stone)]"
                          : isComplete
                          ? "bg-green-50"
                          : "bg-white"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isComplete
                            ? "bg-green-100"
                            : isCurrent
                            ? "bg-[var(--gold)]/20"
                            : "bg-[var(--stone)]"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 text-[var(--gold)] spinner" />
                        ) : (
                          <Icon
                            className={`w-5 h-5 ${
                              isPending
                                ? "text-[var(--slate)]/50"
                                : "text-[var(--gold)]"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-sans font-medium ${
                            isPending
                              ? "text-[var(--slate)]/50"
                              : "text-[var(--navy)]"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <AnimatePresence mode="wait">
                            <motion.p
                              key={status.message}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-sm text-[var(--slate)]"
                            >
                              {status.message}
                            </motion.p>
                          </AnimatePresence>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-[var(--stone)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${status.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] rounded-full"
                />
              </div>

              {/* Complete State */}
              {status.step === "complete" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-sans font-semibold text-[var(--navy)] mb-2">
                    Your Landing Page is Ready!
                  </h3>
                  <p className="text-[var(--slate)]">
                    Redirecting to preview...
                  </p>
                </motion.div>
              )}

              {/* Tips while waiting */}
              {status.step === "extracting" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-6 p-4 bg-[var(--stone)] rounded-xl"
                >
                  <p className="text-sm text-[var(--slate)] text-center">
                    <span className="font-semibold text-[var(--navy)]">
                      Did you know?
                    </span>{" "}
                    We analyze your content using methodologies from world-class
                    framework builders like Chip & Dan Heath, Jonah Berger, and
                    Donald Miller.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
