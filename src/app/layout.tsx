import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { 
  Inter, 
  Mukta, 
  Playfair_Display, 
  Lora, 
  Cormorant_Garamond, 
  EB_Garamond, 
  Alegreya, 
  Outfit, 
  Mulish, 
  Plus_Jakarta_Sans, 
  Alegreya_Sans 
} from "next/font/google";
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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-eb-garamond",
});

const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-alegreya",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mulish",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
});

const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-alegreya-sans",
});

export const metadata: Metadata = {
  title: "Godwa | Premium Marathi Poetry Platform",
  description: "Experience the beauty of Marathi literature with our interactive Rekhta-style reader.",
  icons: {
    icon: [{ url: '/icon-512.png', type: 'image/png' }],
    apple: [{ url: '/icon-512.png', type: 'image/png' }],
    shortcut: '/icon-512.png',
  },
  openGraph: {
    siteName: 'Godwa Marathi Poem Platform',
    images: [{ url: '/icon-512.png', width: 512, height: 512 }],
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
      </head>
      <body
        className={`${mukta.variable} ${inter.variable} ${playfair.variable} ${lora.variable} ${cormorant.variable} ${ebGaramond.variable} ${alegreya.variable} ${outfit.variable} ${mulish.variable} ${jakarta.variable} ${alegreyaSans.variable} antialiased font-marathi selection:bg-gold/30`}      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
