import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter, Mukta, Playfair_Display } from "next/font/google";
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
        className={`${mukta.variable} ${inter.variable} ${playfair.variable} antialiased font-marathi selection:bg-gold/30`}      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
