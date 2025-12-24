import { Metadata } from "next";
import Link from "next/link";
import { FAQSchema, BreadcrumbSchema } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Talk to Landing. Learn how to transform YouTube videos and transcripts into professional landing pages.",
  alternates: {
    canonical: "https://talktolanding.theresonance.studio/faq",
  },
};

const faqs = [
  {
    question: "What is Talk to Landing?",
    answer:
      "Talk to Landing is an AI-powered tool that transforms YouTube videos, podcasts, and meeting transcripts into professional, conversion-ready landing pages. It extracts your unique framework, key messages, and value propositions automatically.",
  },
  {
    question: "How does Talk to Landing work?",
    answer:
      "Simply paste a YouTube URL or your transcript, and our AI analyzes your content to extract your unique positioning and framework. Within minutes, you receive a professionally designed landing page ready to use.",
  },
  {
    question: "What types of content can I use?",
    answer:
      "You can use YouTube videos (the tool extracts captions automatically), podcast transcripts, meeting recordings, webinar transcripts, or any text-based transcript of spoken content.",
  },
  {
    question: "Do I need technical skills to use Talk to Landing?",
    answer:
      "No technical skills are required. Just paste your content and the AI handles everything. You can export the finished landing page as HTML and deploy it anywhere.",
  },
  {
    question: "How many landing pages can I create for free?",
    answer:
      "The free tier includes 3 landing page generations. For unlimited generations, contact us about upgrading your account.",
  },
  {
    question: "Can I customize the landing page after it's generated?",
    answer:
      "Yes. You can export the landing page as HTML and modify it however you like. The generated code is clean and well-structured for easy customization.",
  },
  {
    question: "What if my YouTube video doesn't have captions?",
    answer:
      "If your video doesn't have captions, you can paste a transcript manually. This works great for meeting recordings, podcast episodes, or any other spoken content you have transcribed.",
  },
  {
    question: "Who is Talk to Landing best for?",
    answer:
      "Talk to Landing is ideal for speakers, coaches, consultants, course creators, podcasters, and thought leaders who want to turn their spoken content into marketing assets.",
  },
  {
    question: "How long does it take to generate a landing page?",
    answer:
      "Most landing pages are generated in under 2 minutes. The exact time depends on the length of your content.",
  },
  {
    question: "Is my content secure?",
    answer:
      "Yes. We process your content securely and don't store your transcripts or generated landing pages on our servers after delivery.",
  },
];

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://talktolanding.theresonance.studio" },
          {
            name: "FAQ",
            url: "https://talktolanding.theresonance.studio/faq",
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

          <h1 className="text-4xl font-bold text-[var(--navy)] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[var(--slate)] mb-12">
            Everything you need to know about Talk to Landing
          </p>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-[var(--slate)]/10"
              >
                <h2 className="text-lg font-semibold text-[var(--navy)] mb-3">
                  {faq.question}
                </h2>
                <p className="text-[var(--slate)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--slate)]/20">
            <p className="text-[var(--slate)] mb-4">
              Have a question that's not answered here?
            </p>
            <a
              href="https://www.theresonance.studio/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--navy)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--gold)] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
