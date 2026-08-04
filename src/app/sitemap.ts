import { MetadataRoute } from "next";

const BASE_URL = "https://godwa.space";
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://iampratham29-godwa-backend.hf.space").replace(/\/$/, "");

interface PoemSlim {
    id: number;
    url_slug?: string;
    updated_at?: string;
}

interface PoetSlim {
    id: number;
    updated_at?: string;
}

async function fetchPoems(): Promise<PoemSlim[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/poems/?status=approved&limit=1000`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

async function fetchPoets(): Promise<PoetSlim[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/poets/all`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    // Static pages
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about-us`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/explore`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/poets`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/submit`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    // Dynamic Poem Routes
    const poems = await fetchPoems();
    const poemRoutes: MetadataRoute.Sitemap = poems.map((poem) => {
        const identifier = poem.url_slug || poem.id;
        return {
            url: `${BASE_URL}/poem/${identifier}`,
            lastModified: poem.updated_at ? new Date(poem.updated_at) : now,
            changeFrequency: "weekly",
            priority: 0.8,
        };
    });

    // Dynamic Poet Routes
    const poets = await fetchPoets();
    const poetRoutes: MetadataRoute.Sitemap = poets.map((poet) => {
        return {
            url: `${BASE_URL}/poets/${poet.id}`,
            lastModified: poet.updated_at ? new Date(poet.updated_at) : now,
            changeFrequency: "monthly",
            priority: 0.7,
        };
    });

    return [...staticRoutes, ...poemRoutes, ...poetRoutes];
}
