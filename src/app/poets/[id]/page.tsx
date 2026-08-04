import { Metadata } from "next";
import { PoetOut } from "@/lib/types";
import { PoetProfileClientView } from "./PoetProfileClientView";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://iampratham29-godwa-backend.hf.space").replace(/\/$/, "");

async function fetchPoetData(id: string): Promise<PoetOut | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/poets/${id}`, {
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
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const poet = await fetchPoetData(id);

    if (!poet) {
        return {
            title: "Poet Profile Not Found | Godwa",
            description: "The requested poet profile could not be found on Godwa.",
        };
    }

    const poetName = poet.name_roman ? `${poet.name} (${poet.name_roman})` : poet.name;
    const title = `${poetName} – Marathi Poet Profile & Works | Godwa`;
    const description = poet.bio
        ? poet.bio.slice(0, 160)
        : `Explore the life, bio, and complete poetry collection of legendary Marathi poet ${poet.name} on Godwa.`;

    const canonicalUrl = `https://godwa.space/poets/${id}`;

    return {
        title,
        description,
        keywords: [
            poet.name,
            poet.name_roman || "",
            "Marathi poet",
            "Marathi literature",
            "Kavita",
            "Godwa poets",
        ].filter(Boolean),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "profile",
            url: canonicalUrl,
            siteName: "Godwa",
            title,
            description,
            locale: "mr_IN",
            images: poet.image_url
                ? [{ url: poet.image_url, width: 400, height: 400, alt: poetName }]
                : [{ url: "/icon-512.png", width: 512, height: 512, alt: poetName }],
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: poet.image_url ? [poet.image_url] : ["/icon-512.png"],
        },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const poet = await fetchPoetData(id);

    const jsonLd = poet
        ? {
            "@context": "https://schema.org",
            "@type": "Person",
            name: poet.name,
            alternateName: poet.name_roman || undefined,
            description: poet.bio || undefined,
            image: poet.image_url || undefined,
            jobTitle: "Poet",
            url: `https://godwa.space/poets/${id}`,
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
            <PoetProfileClientView />
        </>
    );
}
