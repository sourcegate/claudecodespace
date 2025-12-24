import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talk to Landing | Transform Your YouTube Talk Into a Platform",
  description: "Turn any YouTube video into a premium, commercial-ready landing page. Extract your unique framework, positioning, and intellectual property automatically.",
  keywords: ["thought leadership", "landing page generator", "YouTube", "framework extraction", "content repurposing"],
  openGraph: {
    title: "Talk to Landing",
    description: "Transform any YouTube talk into a premium landing page",
    type: "website",
  },
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
      </body>
    </html>
  );

  // Skip ClerkProvider if keys not configured (for local dev without Clerk)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
