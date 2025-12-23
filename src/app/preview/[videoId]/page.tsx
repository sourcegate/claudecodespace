"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Play,
  BookOpen,
  Users,
  Mic,
  Briefcase,
  ChevronRight,
  Quote,
  Mail,
  Twitter,
  Linkedin,
} from "lucide-react";
import { ExtractedContent } from "@/lib/types";

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;

  const [content, setContent] = useState<ExtractedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Try to get content from sessionStorage
    const stored = sessionStorage.getItem(`landing-${videoId}`);
    if (stored) {
      setContent(JSON.parse(stored));
      setIsLoading(false);
    } else {
      // If no content, redirect to generate page
      router.push(`/generate/${videoId}`);
    }
  }, [videoId, router]);

  const handleDownload = () => {
    if (!content) return;

    const htmlContent = generateFullHTML(content);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.speakerName.replace(/\s+/g, "-").toLowerCase()}-landing-page.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-[var(--gold)] mx-auto mb-4 spinner" />
          <p className="text-[var(--slate)] font-sans">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <>
      {/* Floating Controls */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between"
        >
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg font-sans text-sm text-[var(--navy)] hover:bg-[var(--stone)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(false)}
              className="px-4 py-2 bg-white rounded-xl shadow-lg font-sans text-sm text-[var(--slate)] hover:bg-[var(--stone)] transition-colors"
            >
              Hide Controls
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--navy)] text-white rounded-xl shadow-lg font-sans text-sm hover:bg-[var(--navy-light)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download HTML
            </button>
          </div>
        </motion.div>
      )}

      {/* Show controls button when hidden */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg hover:bg-[var(--stone)] transition-colors"
        >
          <Sparkles className="w-5 h-5 text-[var(--gold)]" />
        </button>
      )}

      {/* Generated Landing Page */}
      <div className="landing-page">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--cream)]/90 backdrop-blur-md border-b border-[var(--stone)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="font-sans font-semibold text-[var(--navy)]">
              {content.speakerName}
            </span>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#framework"
                className="text-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors font-sans"
              >
                Framework
              </a>
              <a
                href="#book"
                className="text-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors font-sans"
              >
                Book
              </a>
              <a
                href="#work-together"
                className="text-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors font-sans"
              >
                Work Together
              </a>
              <a
                href="#contact"
                className="btn-gold px-4 py-2 rounded-lg font-sans text-sm font-semibold"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-[var(--cream)]">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-[var(--stone)] text-[var(--slate)] text-sm font-sans mb-6">
                  {content.positioning.titleDescriptor}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-[var(--navy)] leading-tight mb-6">
                  {content.positioning.tagline}
                </h1>
                <p className="text-xl text-[var(--slate)] mb-8">
                  {content.positioning.oneSentence}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#work-together"
                    className="btn-gold px-6 py-3 rounded-xl font-sans font-semibold inline-flex items-center gap-2"
                  >
                    Work With Me
                    <ChevronRight className="w-5 h-5" />
                  </a>
                  <a
                    href="#framework"
                    className="btn-primary px-6 py-3 rounded-xl font-sans font-semibold inline-flex items-center gap-2"
                  >
                    Explore the Framework
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${content.videoId}`}
                    title={content.talkTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Question Section */}
        <section className="py-20 px-6 bg-[var(--navy)]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-8">
                {content.signatureQuestion.question}
              </h2>
              <p className="text-white/70 text-lg mb-12">
                {content.signatureQuestion.reframingPower}
              </p>

              {/* Three Layer Reframe */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-2xl p-6 text-left">
                  <span className="text-[var(--gold)] font-sans font-semibold text-sm uppercase tracking-wider">
                    What You Think
                  </span>
                  <p className="text-white mt-3">
                    {content.threeLayerReframe.level1Think}
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-left">
                  <span className="text-[var(--gold)] font-sans font-semibold text-sm uppercase tracking-wider">
                    What You Say
                  </span>
                  <p className="text-white mt-3">
                    {content.threeLayerReframe.level2Say}
                  </p>
                </div>
                <div className="bg-[var(--gold)]/20 rounded-2xl p-6 text-left border-2 border-[var(--gold)]">
                  <span className="text-[var(--gold)] font-sans font-semibold text-sm uppercase tracking-wider">
                    The Truth
                  </span>
                  <p className="text-white mt-3 font-semibold">
                    {content.threeLayerReframe.level3Actually}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About / Bio Section */}
        <section className="py-20 px-6 bg-[var(--stone)]">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="aspect-[3/4] rounded-2xl bg-[var(--navy)] overflow-hidden relative">
                  <img
                    src={`https://img.youtube.com/vi/${content.videoId}/maxresdefault.jpg`}
                    alt={content.speakerName}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-transparent to-transparent" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-[var(--navy)] mb-6">
                  Meet {content.speakerName}
                </h2>
                <div className="prose-premium text-[var(--slate)] whitespace-pre-line">
                  {content.speakerBio}
                </div>

                {/* Pull Quote */}
                <div className="mt-8 relative pl-6 border-l-4 border-[var(--gold)]">
                  <Quote className="absolute -left-3 -top-2 w-6 h-6 text-[var(--gold)] bg-[var(--stone)]" />
                  <p className="text-lg italic text-[var(--navy)]">
                    &ldquo;{content.pullQuote}&rdquo;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Framework Section */}
        <section id="framework" className="py-20 px-6 bg-[var(--cream)]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-[var(--navy)] mb-4">
                The {content.acronymFramework.acronym} Framework
              </h2>
              <p className="text-xl text-[var(--slate)]">
                {content.acronymFramework.fullName}
              </p>
            </motion.div>

            <div className="space-y-6">
              {content.acronymFramework.letters.map((letter, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-[var(--navy)] flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl font-sans font-bold text-[var(--gold)]">
                        {letter.letter}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-sans font-semibold text-[var(--navy)] mb-3">
                        {letter.principle}
                      </h3>
                      <p className="text-[var(--slate)] mb-4">
                        {letter.explanation}
                      </p>

                      {letter.discoveryQuestions.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-sans font-semibold text-[var(--navy)] text-sm uppercase tracking-wider mb-2">
                            Ask Yourself:
                          </h4>
                          <ul className="space-y-2">
                            {letter.discoveryQuestions.map((q, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-[var(--slate)]"
                              >
                                <ChevronRight className="w-4 h-4 text-[var(--gold)] flex-shrink-0 mt-1" />
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {letter.supportingQuote && (
                        <blockquote className="border-l-3 border-[var(--gold)] pl-4 italic text-[var(--slate)]">
                          &ldquo;{letter.supportingQuote}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Book Section */}
        <section id="book" className="py-20 px-6 bg-[var(--navy)]">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {/* Book Mockup */}
                <div className="relative">
                  <div className="w-64 mx-auto bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] rounded-lg p-1 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                    <div className="bg-white rounded-lg p-8 aspect-[3/4] flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-[var(--slate)] font-sans uppercase tracking-wider mb-2">
                          Coming Soon
                        </p>
                        <h3 className="text-2xl font-sans font-bold text-[var(--navy)] leading-tight">
                          {content.bookConcept.workingTitle}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--slate)]">
                          {content.bookConcept.subtitle}
                        </p>
                        <p className="text-sm font-sans font-semibold text-[var(--navy)] mt-4">
                          {content.speakerName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[var(--gold)] font-sans font-semibold text-sm uppercase tracking-wider">
                  The Book
                </span>
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mt-2 mb-6">
                  {content.bookConcept.workingTitle}
                </h2>
                <p className="text-white/70 text-lg mb-8">
                  {content.bookConcept.description}
                </p>

                <div className="space-y-4 mb-8">
                  {content.bookConcept.threePartStructure.map((part, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[var(--gold)] font-sans font-semibold text-sm">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-sans font-semibold">
                          {part.part}
                        </h4>
                        <p className="text-white/60 text-sm">{part.theme}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn-gold px-6 py-3 rounded-xl font-sans font-semibold inline-flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Join the Waitlist
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Work Together Section */}
        <section id="work-together" className="py-20 px-6 bg-[var(--cream)]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-[var(--navy)] mb-4">
                Work With {content.speakerName.split(" ")[0]}
              </h2>
              <p className="text-xl text-[var(--slate)]">
                Transform your organization with proven frameworks and
                strategies.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {content.serviceTiers.map((tier, index) => {
                const icons = [Mic, Users, Briefcase];
                const Icon = icons[index] || Briefcase;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-2xl p-8 ${
                      index === 1
                        ? "bg-[var(--navy)] text-white"
                        : "bg-white shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                        index === 1 ? "bg-[var(--gold)]/20" : "bg-[var(--stone)]"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          index === 1 ? "text-[var(--gold)]" : "text-[var(--navy)]"
                        }`}
                      />
                    </div>

                    <h3
                      className={`text-xl font-sans font-semibold mb-2 ${
                        index === 1 ? "text-white" : "text-[var(--navy)]"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`mb-6 ${
                        index === 1 ? "text-white/70" : "text-[var(--slate)]"
                      }`}
                    >
                      {tier.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {tier.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight
                            className={`w-4 h-4 flex-shrink-0 mt-1 ${
                              index === 1
                                ? "text-[var(--gold)]"
                                : "text-[var(--gold)]"
                            }`}
                          />
                          <span
                            className={
                              index === 1 ? "text-white/80" : "text-[var(--slate)]"
                            }
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <p
                      className={`text-sm mb-6 ${
                        index === 1 ? "text-white/60" : "text-[var(--slate)]"
                      }`}
                    >
                      <span className="font-semibold">Ideal for:</span>{" "}
                      {tier.idealFor}
                    </p>

                    <button
                      className={`w-full py-3 rounded-xl font-sans font-semibold transition-colors ${
                        index === 1
                          ? "btn-gold"
                          : "bg-[var(--stone)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                      }`}
                    >
                      Learn More
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pull Quote Section */}
        <section className="py-20 px-6 bg-[var(--stone)]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Quote className="w-16 h-16 text-[var(--gold)]/30 mx-auto mb-6" />
              <blockquote className="text-2xl md:text-3xl lg:text-4xl text-[var(--navy)] font-serif italic leading-relaxed">
                &ldquo;{content.corePhilosophy.powerfulQuotes[0]}&rdquo;
              </blockquote>
              <p className="mt-8 text-[var(--slate)] font-sans font-semibold">
                {content.speakerName}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="contact" className="py-20 px-6 bg-[var(--navy)]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mb-4">
                {content.signatureQuestion.question}
              </h2>
              <p className="text-white/70 text-lg mb-8">
                {content.corePhilosophy.centralBelief}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="btn-gold px-8 py-4 rounded-xl font-sans font-semibold text-lg inline-flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-[var(--navy)] border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-sans font-semibold text-white">
                  {content.speakerName}
                </p>
                <p className="text-white/50 text-sm">
                  {content.positioning.titleDescriptor}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-5 h-5 text-white" />
                </a>
              </div>

              <p className="text-white/50 text-sm font-sans">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function generateFullHTML(content: ExtractedContent): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.speakerName} - ${content.positioning.tagline}</title>
  <meta name="description" content="${content.positioning.oneSentence}">
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --navy: #1a1a2e;
      --navy-light: #2d2d44;
      --gold: #c9a227;
      --gold-light: #e8d48b;
      --cream: #FAFAF8;
      --stone: #f5f5f0;
      --slate: #64748b;
    }
    body {
      font-family: 'Source Serif 4', Georgia, serif;
      background: var(--cream);
      color: var(--navy);
      line-height: 1.7;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: 'DM Sans', system-ui, sans-serif;
    }
    .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }
    .font-serif { font-family: 'Source Serif 4', Georgia, serif; }
    .bg-navy { background-color: var(--navy); }
    .bg-cream { background-color: var(--cream); }
    .bg-stone { background-color: var(--stone); }
    .text-navy { color: var(--navy); }
    .text-gold { color: var(--gold); }
    .text-slate { color: var(--slate); }
    .border-gold { border-color: var(--gold); }
    .btn-gold {
      background: linear-gradient(135deg, var(--gold) 0%, #d4af37 100%);
      color: var(--navy);
      transition: all 0.3s ease;
    }
    .btn-gold:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -10px rgba(201, 162, 39, 0.4);
    }
    .btn-primary {
      background: var(--navy);
      color: white;
      transition: all 0.3s ease;
    }
    .btn-primary:hover {
      background: var(--navy-light);
      transform: translateY(-2px);
    }
  </style>
</head>
<body class="antialiased">
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-stone">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <span class="font-sans font-semibold text-navy">${content.speakerName}</span>
      <div class="hidden md:flex items-center gap-8">
        <a href="#framework" class="text-sm text-slate hover:text-navy transition-colors font-sans">Framework</a>
        <a href="#book" class="text-sm text-slate hover:text-navy transition-colors font-sans">Book</a>
        <a href="#work-together" class="text-sm text-slate hover:text-navy transition-colors font-sans">Work Together</a>
        <a href="#contact" class="btn-gold px-4 py-2 rounded-lg font-sans text-sm font-semibold">Get in Touch</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="pt-32 pb-20 px-6 bg-cream">
    <div class="max-w-5xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span class="inline-block px-4 py-2 rounded-full bg-stone text-slate text-sm font-sans mb-6">
            ${content.positioning.titleDescriptor}
          </span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-navy leading-tight mb-6">
            ${content.positioning.tagline}
          </h1>
          <p class="text-xl text-slate mb-8">
            ${content.positioning.oneSentence}
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="#work-together" class="btn-gold px-6 py-3 rounded-xl font-sans font-semibold inline-flex items-center gap-2">
              Work With Me
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
            <a href="#framework" class="btn-primary px-6 py-3 rounded-xl font-sans font-semibold">
              Explore the Framework
            </a>
          </div>
        </div>
        <div class="relative">
          <div class="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe src="https://www.youtube.com/embed/${content.videoId}" title="${content.talkTitle}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- The Question Section -->
  <section class="py-20 px-6 bg-navy">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-8">
        ${content.signatureQuestion.question}
      </h2>
      <p class="text-white/70 text-lg mb-12">${content.signatureQuestion.reframingPower}</p>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white/10 rounded-2xl p-6 text-left">
          <span class="text-gold font-sans font-semibold text-sm uppercase tracking-wider">What You Think</span>
          <p class="text-white mt-3">${content.threeLayerReframe.level1Think}</p>
        </div>
        <div class="bg-white/10 rounded-2xl p-6 text-left">
          <span class="text-gold font-sans font-semibold text-sm uppercase tracking-wider">What You Say</span>
          <p class="text-white mt-3">${content.threeLayerReframe.level2Say}</p>
        </div>
        <div class="bg-gold/20 rounded-2xl p-6 text-left border-2 border-gold">
          <span class="text-gold font-sans font-semibold text-sm uppercase tracking-wider">The Truth</span>
          <p class="text-white mt-3 font-semibold">${content.threeLayerReframe.level3Actually}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="py-20 px-6 bg-stone">
    <div class="max-w-5xl mx-auto">
      <div class="grid lg:grid-cols-5 gap-12 items-start">
        <div class="lg:col-span-2">
          <div class="aspect-[3/4] rounded-2xl bg-navy overflow-hidden relative">
            <img src="https://img.youtube.com/vi/${content.videoId}/maxresdefault.jpg" alt="${content.speakerName}" class="w-full h-full object-cover opacity-90">
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"></div>
          </div>
        </div>
        <div class="lg:col-span-3">
          <h2 class="text-3xl md:text-4xl font-sans font-bold text-navy mb-6">Meet ${content.speakerName}</h2>
          <div class="text-slate whitespace-pre-line">${content.speakerBio}</div>
          <div class="mt-8 relative pl-6 border-l-4 border-gold">
            <p class="text-lg italic text-navy">"${content.pullQuote}"</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Framework Section -->
  <section id="framework" class="py-20 px-6 bg-cream">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-sans font-bold text-navy mb-4">The ${content.acronymFramework.acronym} Framework</h2>
        <p class="text-xl text-slate">${content.acronymFramework.fullName}</p>
      </div>
      <div class="space-y-6">
        ${content.acronymFramework.letters
          .map(
            (letter) => `
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <div class="flex items-start gap-6">
            <div class="w-16 h-16 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
              <span class="text-3xl font-sans font-bold text-gold">${letter.letter}</span>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-sans font-semibold text-navy mb-3">${letter.principle}</h3>
              <p class="text-slate mb-4">${letter.explanation}</p>
              ${
                letter.discoveryQuestions.length > 0
                  ? `
              <div class="mb-4">
                <h4 class="font-sans font-semibold text-navy text-sm uppercase tracking-wider mb-2">Ask Yourself:</h4>
                <ul class="space-y-2">
                  ${letter.discoveryQuestions.map((q) => `<li class="flex items-start gap-2 text-slate"><svg class="w-4 h-4 text-gold flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>${q}</li>`).join("")}
                </ul>
              </div>
              `
                  : ""
              }
              ${letter.supportingQuote ? `<blockquote class="border-l-4 border-gold pl-4 italic text-slate">"${letter.supportingQuote}"</blockquote>` : ""}
            </div>
          </div>
        </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Book Section -->
  <section id="book" class="py-20 px-6 bg-navy">
    <div class="max-w-5xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="relative">
            <div class="w-64 mx-auto bg-gradient-to-br from-gold to-gold-light rounded-lg p-1 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
              <div class="bg-white rounded-lg p-8 aspect-[3/4] flex flex-col justify-between">
                <div>
                  <p class="text-xs text-slate font-sans uppercase tracking-wider mb-2">Coming Soon</p>
                  <h3 class="text-2xl font-sans font-bold text-navy leading-tight">${content.bookConcept.workingTitle}</h3>
                </div>
                <div>
                  <p class="text-sm text-slate">${content.bookConcept.subtitle}</p>
                  <p class="text-sm font-sans font-semibold text-navy mt-4">${content.speakerName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span class="text-gold font-sans font-semibold text-sm uppercase tracking-wider">The Book</span>
          <h2 class="text-3xl md:text-4xl font-sans font-bold text-white mt-2 mb-6">${content.bookConcept.workingTitle}</h2>
          <p class="text-white/70 text-lg mb-8">${content.bookConcept.description}</p>
          <div class="space-y-4 mb-8">
            ${content.bookConcept.threePartStructure
              .map(
                (part, i) => `
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span class="text-gold font-sans font-semibold text-sm">${i + 1}</span>
              </div>
              <div>
                <h4 class="text-white font-sans font-semibold">${part.part}</h4>
                <p class="text-white/60 text-sm">${part.theme}</p>
              </div>
            </div>
            `
              )
              .join("")}
          </div>
          <button class="btn-gold px-6 py-3 rounded-xl font-sans font-semibold inline-flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            Join the Waitlist
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Work Together Section -->
  <section id="work-together" class="py-20 px-6 bg-cream">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-sans font-bold text-navy mb-4">Work With ${content.speakerName.split(" ")[0]}</h2>
        <p class="text-xl text-slate">Transform your organization with proven frameworks and strategies.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        ${content.serviceTiers
          .map(
            (tier, index) => `
        <div class="rounded-2xl p-8 ${index === 1 ? "bg-navy text-white" : "bg-white shadow-sm"}">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${index === 1 ? "bg-gold/20" : "bg-stone"}">
            <svg class="w-6 h-6 ${index === 1 ? "text-gold" : "text-navy"}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </div>
          <h3 class="text-xl font-sans font-semibold mb-2 ${index === 1 ? "text-white" : "text-navy"}">${tier.name}</h3>
          <p class="mb-6 ${index === 1 ? "text-white/70" : "text-slate"}">${tier.description}</p>
          <ul class="space-y-3 mb-8">
            ${tier.included.map((item) => `<li class="flex items-start gap-2"><svg class="w-4 h-4 flex-shrink-0 mt-1 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg><span class="${index === 1 ? "text-white/80" : "text-slate"}">${item}</span></li>`).join("")}
          </ul>
          <p class="text-sm mb-6 ${index === 1 ? "text-white/60" : "text-slate"}"><span class="font-semibold">Ideal for:</span> ${tier.idealFor}</p>
          <button class="w-full py-3 rounded-xl font-sans font-semibold transition-colors ${index === 1 ? "btn-gold" : "bg-stone text-navy hover:bg-navy hover:text-white"}">Learn More</button>
        </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Pull Quote Section -->
  <section class="py-20 px-6 bg-stone">
    <div class="max-w-4xl mx-auto text-center">
      <svg class="w-16 h-16 text-gold/30 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
      <blockquote class="text-2xl md:text-3xl lg:text-4xl text-navy font-serif italic leading-relaxed">
        "${content.corePhilosophy.powerfulQuotes[0]}"
      </blockquote>
      <p class="mt-8 text-slate font-sans font-semibold">${content.speakerName}</p>
    </div>
  </section>

  <!-- Final CTA Section -->
  <section id="contact" class="py-20 px-6 bg-navy">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-sans font-bold text-white mb-4">${content.signatureQuestion.question}</h2>
      <p class="text-white/70 text-lg mb-8">${content.corePhilosophy.centralBelief}</p>
      <button class="btn-gold px-8 py-4 rounded-xl font-sans font-semibold text-lg inline-flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        Get in Touch
      </button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 px-6 bg-navy border-t border-white/10">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p class="font-sans font-semibold text-white">${content.speakerName}</p>
          <p class="text-white/50 text-sm">${content.positioning.titleDescriptor}</p>
        </div>
        <div class="flex items-center gap-4">
          <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </a>
        </div>
        <p class="text-white/50 text-sm font-sans">&copy; ${new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}
