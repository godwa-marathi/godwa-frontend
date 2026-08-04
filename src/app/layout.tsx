import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter, Mukta, Playfair_Display, Lora } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-mukta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: {
    default: "Godwa – Marathi Poetry Platform",
    template: "%s | Godwa",
  },
  description:
    "Godwa is an AI-assisted Marathi poetry platform where readers can explore poems with word-by-word meanings, contextual explanations, Roman transliteration, poet profiles, and Chhanda information. Discover, understand, and preserve Marathi literature.",
  keywords: [
    "Marathi poetry",
    "Marathi poems",
    "Marathi kavita",
    "Marathi literature",
    "Marathi dictionary",
    "Marathi word meanings",
    "Roman Marathi",
    "Marathi transliteration",
    "Boli Bhasha",
    "Godwa",
    "गोडवा",
    "Kusumagraj",
    "Bahinabai",
    "Marathi Chhanda",
  ],
  authors: [{ name: "Godwa", url: "https://godwa.space" }],
  creator: "Godwa",
  publisher: "Godwa",
  metadataBase: new URL("https://godwa.space"),
  alternates: {
    canonical: "https://godwa.space",
  },
  icons: {
    icon: [{ url: "/icon-512.png", type: "image/png" }],
    apple: [{ url: "/icon-512.png", type: "image/png" }],
    shortcut: "/icon-512.png",
  },
  openGraph: {
    type: "website",
    locale: "mr_IN",
    url: "https://godwa.space",
    siteName: "Godwa",
    title: "Godwa – Marathi Poetry Platform",
    description:
      "Explore Marathi poetry with word-by-word meanings, Roman transliteration, Boli Bhasha vocabulary, and poet profiles. Godwa makes Marathi literature accessible to everyone.",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Godwa – Marathi Poetry Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godwa – Marathi Poetry Platform",
    description:
      "Explore Marathi poetry with word-by-word meanings, Roman transliteration, and Boli Bhasha vocabulary.",
    images: ["/icon-512.png"],
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
    <html lang="mr">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://godwa.space/#website",
                  "url": "https://godwa.space",
                  "name": "Godwa",
                  "description": "Premium Marathi Poetry Platform with Word-by-Word Meanings & Roman Transliteration",
                  "inLanguage": "mr",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://godwa.space/explore?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://godwa.space/#organization",
                  "name": "Godwa",
                  "url": "https://godwa.space",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://godwa.space/icon-512.png"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${mukta.variable} ${inter.variable} ${playfair.variable} ${lora.variable} antialiased font-marathi selection:bg-gold/30`}      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
