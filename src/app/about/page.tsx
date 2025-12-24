import { Metadata } from "next";
import Link from "next/link";
import {
  OrganizationSchema,
  WebApplicationSchema,
  BreadcrumbSchema,
} from "@/components/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Talk to Landing is an AI-powered tool that transforms YouTube videos, podcasts, and meeting transcripts into professional landing pages. Built by Thought Owner.",
  alternates: {
    canonical: "https://talktolanding.theresonance.studio/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <OrganizationSchema />
      <WebApplicationSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://talktolanding.theresonance.studio" },
          {
            name: "About",
            url: "https://talktolanding.theresonance.studio/about",
          },
        ]}
      />

      <main className="min-h-screen bg-[var(--cream)]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link
            href="/"
            className="text-[var(--navy)] hover:text-[var(--gold)] transition-colors mb-8 inline-block"
          >
            &larr; Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-[var(--navy)] mb-8">
            About Talk to Landing
          </h1>

          <section className="prose prose-lg max-w-none">
            <p className="text-xl text-[var(--slate)] leading-relaxed mb-8">
              Talk to Landing is an AI-powered tool that transforms YouTube
              videos, podcasts, and meeting transcripts into professional,
              conversion-ready landing pages in minutes.
            </p>

            <h2 className="text-2xl font-semibold text-[var(--navy)] mt-12 mb-4">
              What is Talk to Landing?
            </h2>
            <p className="text-[var(--slate)] leading-relaxed mb-6">
              Talk to Landing takes your spoken content—whether from a YouTube
              video, podcast episode, or meeting recording—and extracts your
              unique framework, key messages, and value propositions. It then
              transforms these insights into a beautifully designed landing page
              that captures your voice and expertise.
            </p>

            <h2 className="text-2xl font-semibold text-[var(--navy)] mt-12 mb-4">
              Who is Talk to Landing for?
            </h2>
            <ul className="text-[var(--slate)] space-y-3 mb-6">
              <li>
                <strong>Speakers and Presenters</strong> who want to turn their
                talks into lead-generating assets
              </li>
              <li>
                <strong>Coaches and Consultants</strong> who need landing pages
                for their methodologies
              </li>
              <li>
                <strong>Course Creators</strong> who want to promote their
                educational content
              </li>
              <li>
                <strong>Podcasters</strong> who want to repurpose episodes into
                marketing materials
              </li>
              <li>
                <strong>Thought Leaders</strong> who want to package their
                intellectual property
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[var(--navy)] mt-12 mb-4">
              How does it work?
            </h2>
            <ol className="text-[var(--slate)] space-y-3 mb-6">
              <li>
                <strong>1. Paste your content</strong> — Enter a YouTube URL or
                paste a transcript from any source
              </li>
              <li>
                <strong>2. AI analyzes your content</strong> — Our AI extracts
                your unique framework, positioning, and key messages
              </li>
              <li>
                <strong>3. Get your landing page</strong> — Receive a
                professionally designed, mobile-responsive landing page ready to
                deploy
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-[var(--navy)] mt-12 mb-4">
              Built by Thought Owner
            </h2>
            <p className="text-[var(--slate)] leading-relaxed mb-6">
              Talk to Landing is built by{" "}
              <a
                href="https://thoughtowner.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--navy)] hover:text-[var(--gold)] transition-colors font-semibold"
              >
                Thought Owner
              </a>
              , a studio dedicated to helping experts package and monetize their
              intellectual property. We believe every great idea deserves a
              platform.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-[var(--slate)]/20">
            <Link
              href="/"
              className="inline-block bg-[var(--navy)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--gold)] transition-colors"
            >
              Try Talk to Landing Free
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
