import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        // Support both old ID format and new slug format
        const endpoint = isNaN(Number(slug)) ? `/api/poems/slug/${slug}` : `/api/poems/${slug}`;
        // API_URL (no NEXT_PUBLIC) is for server-side use; NEXT_PUBLIC_API_URL as fallback
        const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://iampratham29-godwa-backend.hf.space';
        
        const res = await fetch(`${API_URL}${endpoint}`, { cache: 'no-store' });
        if (!res.ok) {
            return { title: 'Godwa Poem' };
        }
        
        const poem = await res.json();
        
        const titleText = poem.title_roman && poem.title_roman !== poem.title 
            ? `${poem.title} (${poem.title_roman})` 
            : poem.title;
        const authorText = poem.poet?.name_roman && poem.poet?.name_roman !== poem.poet?.name 
            ? `${poem.poet?.name} (${poem.poet?.name_roman})` 
            : (poem.poet?.name || 'Unknown');
        const displayTitle = `${titleText} by ${authorText} | Godwa`;
        
        // Clean description or use default
        const firstLineMarathi = poem.body_marathi?.split('\n')[0]?.replace(/[\\r\\n]/g, "")?.trim() || "";
        const firstLineRoman = poem.body_roman?.split('\n')[0]?.replace(/[\\r\\n]/g, "")?.trim() || "";
        const firstLineMeaning = poem.body_meaning?.split('\n')[0]?.replace(/[\\r\\n]/g, "")?.trim() || "";
        
        const descriptionParts = [
            firstLineMarathi && `"${firstLineMarathi}"`,
            firstLineRoman && `"${firstLineRoman}"`,
            firstLineMeaning && `"${firstLineMeaning}"`
        ].filter(Boolean).join(" / ");
        
        const description = descriptionParts 
            ? `${descriptionParts}. Read "${poem.title_roman || poem.title}" on Godwa.`
            : (poem.description || "Read this beautiful Marathi poem on Godwa.");
        
        // OG images must be absolute URLs — relative paths won't load in WhatsApp/Twitter previews
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://godwa.space';
        // Use the new dynamic Serverless Chromium OG image route
        const ogImage = `${SITE_URL}/api/og/${slug}`;

        return {
            title: displayTitle,
            description: description,
            openGraph: {
                title: displayTitle,
                description: description,
                type: 'article',
                images: [{ 
                    url: ogImage,
                    width: 1200, 
                    height: 630,
                    alt: `${authorText} - Godwa Marathi Poetry`,
                }],
                siteName: 'Godwa Marathi Poem Platform',
            },
            twitter: {
                card: 'summary_large_image',
                title: displayTitle,
                description: description,
                images: [ogImage],
            }
        };
    } catch (e) {
        return { 
            title: 'Godwa Marathi Poem Platform',
            description: 'Read beautiful Marathi poetry.'
        };
    }
}

export default async function PoemLayout({ 
    children,
    params
}: { 
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    let jsonLd = null;

    try {
        const endpoint = isNaN(Number(slug)) ? `/api/poems/slug/${slug}` : `/api/poems/${slug}`;
        const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://iampratham29-godwa-backend.hf.space';
        
        const res = await fetch(`${API_URL}${endpoint}`, { cache: 'no-store' });
        if (res.ok) {
            const poem = await res.json();
            jsonLd = {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": poem.title,
                "alternativeHeadline": poem.title_roman,
                "author": {
                    "@type": "Person",
                    "name": poem.poet?.name || 'Traditional'
                },
                "translationOfWork": {
                    "@type": "CreativeWork",
                    "text": poem.body_marathi,
                    "inLanguage": "mr"
                },
                "workTranslation": [
                    poem.body_roman && {
                        "@type": "CreativeWork",
                        "text": poem.body_roman,
                        "inLanguage": "mr-Latn"
                    },
                    poem.body_meaning && {
                        "@type": "CreativeWork",
                        "text": poem.body_meaning,
                        "inLanguage": "en"
                    }
                ].filter(Boolean)
            };
        }
    } catch (e) {
        console.error("Error generating JSON-LD:", e);
    }

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {children}
        </>
    );
}
