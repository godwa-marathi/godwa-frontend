import type { Metadata } from "next";
import { AboutUsClientView } from "./AboutUsClientView";

export const metadata: Metadata = {
    title: "Godwa – Marathi Poetry, Meanings, Roman Transliteration & Literary Dictionary",
    description:
        "Godwa is an AI-assisted Marathi poetry platform where readers can explore poems with word-by-word meanings, contextual explanations, Roman transliteration, poet profiles, and Chhanda information. Discover, understand, and preserve Marathi literature.",
    keywords: [
        "Marathi poetry",
        "Marathi poems",
        "Marathi kavita",
        "Marathi literature",
        "Marathi dictionary",
        "Marathi word meanings",
        "Marathi vocabulary",
        "Roman Marathi",
        "Marathi transliteration",
        "Boli Bhasha",
        "Marathi poets",
        "Kusumagraj",
        "Bahinabai",
        "Grace",
        "Marathi Chhanda",
        "Marathi metre",
        "Godwa",
        "गोडवा",
    ],
    alternates: {
        canonical: "https://godwa.space/about-us",
    },
    openGraph: {
        title: "Godwa – Marathi Poetry, Meanings, Roman Transliteration & Literary Dictionary",
        description:
            "Godwa is an AI-assisted Marathi poetry platform where readers can explore poems with word-by-word meanings, contextual explanations, Roman transliteration, poet profiles, and Chhanda information.",
        url: "https://godwa.space/about-us",
        siteName: "Godwa",
        locale: "mr_IN",
        type: "website",
        images: [
            {
                url: "https://godwa.space/icon-512.png",
                width: 512,
                height: 512,
                alt: "Godwa – Marathi Poetry Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Godwa – Marathi Poetry for Everyone",
        description:
            "Godwa is an AI-assisted Marathi poetry platform where readers can explore poems with word-by-word meanings, contextual explanations, Roman transliteration, and Chhanda information.",
        images: ["https://godwa.space/icon-512.png"],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://godwa.space/#organization",
            name: "Godwa",
            alternateName: ["गोडवा", "Godwa Marathi Poetry"],
            url: "https://godwa.space",
            logo: {
                "@type": "ImageObject",
                url: "https://godwa.space/icon-512.png",
                width: 512,
                height: 512,
            },
            description:
                "Godwa is a digital home for Marathi poetry. Our mission is to preserve, organize, and make Marathi poetry accessible to everyone—whether you are a lifelong Marathi reader, someone learning the language, or simply curious about Maharashtra's rich literary heritage.",
            foundingDate: "2024",
            knowsAbout: [
                "Marathi poetry",
                "Marathi literature",
                "Boli Bhasha",
                "Devanagari script",
                "Roman transliteration",
                "Marathi vocabulary",
                "Chhanda",
                "Marathi metre",
            ],
        },
        {
            "@type": "WebSite",
            "@id": "https://godwa.space/#website",
            url: "https://godwa.space",
            name: "Godwa – Marathi Poetry Platform",
            description:
                "Godwa is an AI-assisted Marathi poetry platform with word-by-word meanings, Roman transliteration, and Boli Bhasha vocabulary.",
            publisher: { "@id": "https://godwa.space/#organization" },
            potentialAction: {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://godwa.space/explore?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
            },
            inLanguage: ["mr", "en"],
        },
        {
            "@type": "WebPage",
            "@id": "https://godwa.space/about-us#webpage",
            url: "https://godwa.space/about-us",
            name: "About Godwa – Marathi Poetry, Meanings & Roman Transliteration",
            isPartOf: { "@id": "https://godwa.space/#website" },
            about: { "@id": "https://godwa.space/#organization" },
            breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Godwa", item: "https://godwa.space" },
                    { "@type": "ListItem", position: 2, name: "About", item: "https://godwa.space/about-us" },
                ],
            },
        },
    ],
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutUsClientView />
        </>
    );
}
