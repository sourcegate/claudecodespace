import type { Metadata } from "next";
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
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
