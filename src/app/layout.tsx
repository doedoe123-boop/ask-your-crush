import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://askyourcrush.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ask Your Crush 💘 | Valentine's Invite Generator",
    template: "%s | Ask Your Crush 💘",
  },
  description:
    "Create a cute Valentine's invite link, share it with your crush, and find out if they feel the same way! Free, fun, and anonymous. Sana all may jowa! 💕",
  keywords: [
    "valentine",
    "valentines day",
    "crush",
    "love",
    "invite",
    "date",
    "romantic",
    "ask out",
    "valentine invite",
    "confession",
  ],
  authors: [{ name: "Ask Your Crush" }],
  creator: "Ask Your Crush",
  openGraph: {
    title: "Ask Your Crush 💘 | Valentine's Invite Generator",
    description:
      "Create a cute Valentine's invite link and find out if your crush feels the same way! 💕",
    url: siteUrl,
    siteName: "Ask Your Crush",
    images: [
      {
        url: "/ask-your-crush.png",
        width: 1200,
        height: 630,
        alt: "Ask Your Crush - Valentine's Invite Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask Your Crush 💘 | Valentine's Invite Generator",
    description:
      "Create a cute Valentine's invite link and find out if your crush feels the same way! 💕",
    images: ["/ask-your-crush.png"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
