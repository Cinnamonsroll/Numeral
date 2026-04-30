import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata: Metadata = {
  title: "Numeral - Daily Number Guessing Game",
  description: "Guess the secret 5-digit code in 6 tries. A daily number game like Wordle.",
  keywords: ["numeral", "number game", "wordle", "daily game", "puzzle"],
  openGraph: {
    title: "Numeral - Daily Number Guessing Game",
    description: "Guess the secret 5-digit code in 6 tries.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Numeral - Daily Number Guessing Game",
    description: "Guess the secret 5-digit code in 6 tries.",
  },
  icons: {
    icon: [{ url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f95e.svg", type: "image/svg+xml" }],
  },
  themeColor: "#6B9E7A",
};

export const viewport: Viewport = {
  themeColor: "#6B9E7A",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
          <Toaster theme="dark" position="top-right" className="toast-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
