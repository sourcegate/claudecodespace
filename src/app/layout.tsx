import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Script from "next/script";

const BASE_URL = "https://talktolanding.theresonance.studio";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a2744",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Talk to Landing | Transform Any Talk Into a Landing Page",
    template: "%s | Talk to Landing",
  },
  description:
    "Talk to Landing is an AI-powered tool that transforms YouTube videos, podcasts, and meeting transcripts into professional landing pages. Extract your unique framework, positioning, and intellectual property in minutes.",
  keywords: [
    "landing page generator",
    "AI landing page",
    "YouTube to landing page",
    "transcript to landing page",
    "thought leadership",
    "framework extraction",
    "content repurposing",
    "speaker landing page",
    "coach landing page",
    "consultant landing page",
  ],
  authors: [{ name: "Thought Owner", url: "https://thoughtowner.com" }],
  creator: "Thought Owner",
  publisher: "The Resonance Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Talk to Landing",
    title: "Talk to Landing | Transform Any Talk Into a Landing Page",
    description:
      "AI-powered tool that transforms YouTube videos, podcasts, and meeting transcripts into professional landing pages in minutes.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Talk to Landing - Transform any talk into a landing page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talk to Landing | Transform Any Talk Into a Landing Page",
    description:
      "AI-powered tool that transforms YouTube videos, podcasts, and meeting transcripts into professional landing pages.",
    images: ["/opengraph-image.png"],
    creator: "@thoughtowner",
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <div className="flex-1">{children}</div>
        <footer className="py-6 text-center text-sm text-[var(--slate)] bg-[var(--cream)]">
          Built by{" "}
          <a
            href="https://thoughtowner.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--navy)] hover:text-[var(--gold)] transition-colors"
          >
            Thought Owner
          </a>
        </footer>
        <Analytics />
        <Script
          id="rb2b-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function () {
        var reb2b = window.reb2b = window.reb2b || [];
        if (reb2b.invoked) return;
        reb2b.invoked = true;
        reb2b.methods = ["identify", "collect"];
        reb2b.factory = function (method) {
          return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            reb2b.push(args);
            return reb2b;
          };
        };
        for (var i = 0; i < reb2b.methods.length; i++) {
          var key = reb2b.methods[i];
          reb2b[key] = reb2b.factory(key);
        }
        reb2b.load = function (key) {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";
          var first = document.getElementsByTagName("script")[0];
          first.parentNode.insertBefore(script, first);
        };
        reb2b.SNIPPET_VERSION = "1.0.1";
        reb2b.load("LNKLDHE3PPOJ");
      }();
            `,
          }}
        />
      </body>
    </html>
  );

  // Skip ClerkProvider if keys not configured (for local dev without Clerk)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
