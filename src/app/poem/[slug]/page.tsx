import { Metadata } from "next";
import { PoemOut } from "@/lib/types";
import { PoemClientView } from "./PoemClientView";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://iampratham29-godwa-backend.hf.space").replace(/\/$/, "");

async function fetchPoemData(slug: string): Promise<PoemOut | null> {
    try {
        const endpoint = isNaN(Number(slug)) ? `/api/poems/slug/${slug}` : `/api/poems/${slug}`;
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const poem = await fetchPoemData(slug);

    if (!poem) {
        return {
            title: "Poem Not Found | Godwa",
            description: "The requested Marathi poem could not be found on Godwa.",
        };
    }

    const titleText = poem.title_roman ? `${poem.title} (${poem.title_roman})` : poem.title;
    const poetName = poem.poet?.name || poem.poet?.name_roman || "Traditional";
    const fullTitle = `${titleText} by ${poetName}`;
    const description = poem.description || `Read ${poem.title} by ${poetName} with word-by-word meanings, Roman Marathi transliteration, and commentary on Godwa.`;

    const canonicalUrl = `https://godwa.space/poem/${slug}`;

    return {
        title: fullTitle,
        description,
        keywords: [
            poem.title,
            poem.title_roman || "",
            poetName,
            poem.genre || "",
            "Marathi poem",
            "Marathi kavita",
            "Godwa poetry",
            "word meaning",
            "Roman Marathi",
        ].filter(Boolean),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "article",
            url: canonicalUrl,
            siteName: "Godwa",
            title: fullTitle,
            description,
            locale: "mr_IN",
            images: [
                {
                    url: "/icon-512.png",
                    width: 512,
                    height: 512,
                    alt: fullTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: ["/icon-512.png"],
        },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const poem = await fetchPoemData(slug);

    const jsonLd = poem
        ? {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: poem.title,
            alternateName: poem.title_roman || undefined,
            author: {
                "@type": "Person",
                name: poem.poet?.name || "Traditional",
                alternateName: poem.poet?.name_roman || undefined,
            },
            inLanguage: "mr",
            genre: poem.genre || undefined,
            description: poem.description || undefined,
            publisher: {
                "@type": "Organization",
                name: "Godwa",
                url: "https://godwa.space",
            },
            url: `https://godwa.space/poem/${slug}`,
        }
        : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <PoemClientView />
        </>
    );
}
