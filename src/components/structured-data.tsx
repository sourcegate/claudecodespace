const BASE_URL = "https://talktolanding.theresonance.studio";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Talk to Landing",
    url: BASE_URL,
    logo: `${BASE_URL}/opengraph-image.png`,
    description:
      "AI-powered tool that transforms YouTube videos, podcasts, and meeting transcripts into professional landing pages.",
    founder: {
      "@type": "Organization",
      name: "Thought Owner",
      url: "https://thoughtowner.com",
    },
    sameAs: ["https://www.theresonance.studio"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Talk to Landing",
    url: BASE_URL,
    description:
      "Transform any YouTube video, podcast, or meeting transcript into a professional landing page using AI.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with 3 generations",
    },
    featureList: [
      "YouTube video to landing page conversion",
      "Transcript to landing page conversion",
      "AI-powered framework extraction",
      "Professional HTML export",
      "Mobile-responsive designs",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HowToSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Create a Landing Page from a YouTube Video or Transcript",
    description:
      "Learn how to transform any YouTube video or meeting transcript into a professional landing page in minutes.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste Your Content",
        text: "Paste a YouTube URL or your meeting/podcast transcript into the input field. The tool automatically detects what you've entered.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "AI Analyzes Your Content",
        text: "Our AI extracts your unique framework, key messages, and value propositions from your content.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Get Your Landing Page",
        text: "Receive a professionally designed, mobile-responsive landing page ready to use. Export the HTML and deploy anywhere.",
      },
    ],
    totalTime: "PT5M",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
