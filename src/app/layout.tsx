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

export const metadata: Metadata = {
  title: "Crypto Dashboard - Real-time Cryptocurrency Market Data",
  description:
    "A comprehensive cryptocurrency dashboard featuring real-time market data, price tracking, and market analysis powered by CoinGecko API.",
  keywords: [
    "cryptocurrency",
    "crypto",
    "bitcoin",
    "ethereum",
    "market data",
    "trading",
    "prices",
  ],
  authors: [{ name: "Crypto Dashboard" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Crypto Dashboard - Real-time Cryptocurrency Market Data",
    description:
      "Track cryptocurrency prices, market caps, and trading volumes in real-time",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Dashboard - Real-time Cryptocurrency Market Data",
    description:
      "Track cryptocurrency prices, market caps, and trading volumes in real-time",
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
