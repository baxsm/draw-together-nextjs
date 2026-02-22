import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Draw Together",
    template: "%s | Draw Together",
  },
  description:
    "Real-time collaborative drawing platform for sharing moments of creativity and fun.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://draw-together-nextjs.vercel.app"),
  openGraph: {
    title: "Draw Together",
    description:
      "Real-time collaborative drawing platform for sharing moments of creativity and fun.",
    url: "https://draw-together-nextjs.vercel.app",
    siteName: "Draw Together",
    type: "website",
    images: ["/thumbnail.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Draw Together",
    description:
      "Real-time collaborative drawing platform for sharing moments of creativity and fun.",
    images: ["/thumbnail.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
