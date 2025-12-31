import type { Metadata } from "next";
import { Mukta, EB_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-mukta",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Godwa | Premium Marathi Poetry Platform",
  description: "Experience the beauty of Marathi literature with our interactive Rekhta-style reader.",
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
      </head>
      <body
        className={`${mukta.variable} ${ebGaramond.variable} ${playfair.variable} antialiased font-marathi selection:bg-gold/30`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
