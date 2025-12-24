"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Play, Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

// Dynamic import to avoid SSR issues with Clerk
const AuthNav = dynamic(() => import("@/components/auth-nav").then(mod => mod.AuthNav), {
  ssr: false,
  loading: () => <div className="w-8 h-8 rounded-full bg-[var(--stone)] animate-pulse" />,
});

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const extractVideoId = (input: string): string | null => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
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

    setIsLoading(true);

    // Navigate to processing page with video ID
    router.push(`/generate/${videoId}`);
  };

  const features = [
    "Extract your unique framework and IP",
    "Generate a premium landing page",
    "Download ready-to-deploy code",
  ];

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)]/80 backdrop-blur-md border-b border-[var(--stone)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--navy)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <span className="font-sans font-semibold text-[var(--navy)]">Talk to Landing</span>
          </div>
          <div className="flex items-center gap-4">
            <AuthNav />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--stone)] text-[var(--slate)] text-sm font-sans mb-8">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              Transform any YouTube talk into a platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-[var(--navy)] leading-tight mb-6"
          >
            Your Talk Deserves
            <br />
            <span className="gradient-text">a Platform</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[var(--slate)] max-w-2xl mx-auto mb-12"
          >
            Paste any YouTube URL. We will extract your unique framework,
            positioning, and intellectual property, then generate a premium
            landing page ready for deployment.
          </motion.p>

          {/* URL Input Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
          >
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
          </motion.form>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            {features.map((feature, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-[var(--slate)] text-sm font-sans"
              >
                <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />
                {feature}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-[var(--stone)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-[var(--navy)] mb-4">
              From Video to Platform in Minutes
            </h2>
            <p className="text-[var(--slate)] text-lg max-w-2xl mx-auto">
              Our AI analyzes your talk using methodologies from world-class
              framework builders to extract and commercialize your expertise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Paste Your Link",
                description: "Share any YouTube video URL. We handle talks, lectures, interviews, and presentations.",
              },
              {
                step: "02",
                title: "AI Extracts Your IP",
                description: "We identify your core philosophy, signature stories, frameworks, and quotable moments.",
              },
              {
                step: "03",
                title: "Get Your Platform",
                description: "Receive a premium, StoryBrand-structured landing page with your framework beautifully presented.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <span className="text-5xl font-sans font-bold text-[var(--gold)]/20">
                  {item.step}
                </span>
                <h3 className="text-xl font-sans font-semibold text-[var(--navy)] mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--slate)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-[var(--navy)] mb-4">
              What You Will Get
            </h2>
            <p className="text-[var(--slate)] text-lg max-w-2xl mx-auto">
              A complete thought leadership platform extracted from your content.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Intellectual Property Extraction",
                items: ["Core philosophy and beliefs", "Signature question that reframes", "Origin stories mapped", "Transformation arc identified", "Quotable lines captured"],
              },
              {
                title: "Framework Generation",
                items: ["Custom acronym methodology", "Three-layer positioning reframe", "Comparable expert positioning", "Service tier structure", "Book concept outline"],
              },
              {
                title: "Premium Landing Page",
                items: ["StoryBrand narrative structure", "Editorial design system", "Embedded video showcase", "Framework breakdown sections", "Call-to-action optimization"],
              },
              {
                title: "Ready for Deployment",
                items: ["Clean React/Next.js code", "Mobile responsive design", "Accessible by default", "Performance optimized", "Easy customization"],
              },
            ].map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-[var(--stone)] rounded-2xl p-8"
              >
                <h3 className="text-xl font-sans font-semibold text-[var(--navy)] mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[var(--slate)]">
                      <CheckCircle2 className="w-5 h-5 text-[var(--gold)] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[var(--navy)]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mb-4">
              Ready to Transform Your Talk?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Join thought leaders who have turned their videos into commercial platforms.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="btn-gold px-8 py-4 rounded-xl font-sans font-semibold text-lg inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
