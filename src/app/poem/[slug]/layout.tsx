import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        // Support both old ID format and new slug format
        const endpoint = isNaN(Number(slug)) ? `/api/poems/slug/${slug}` : `/api/poems/${slug}`;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const res = await fetch(`${API_URL}${endpoint}`, { cache: 'no-store' });
        if (!res.ok) {
            return { title: 'Godwa Poem' };
        }
        
        const poem = await res.json();
        
        const titleText = poem.title_roman || poem.title;
        const authorText = poem.poet?.name_roman || poem.poet?.name || 'Unknown';
        const displayTitle = `${titleText} 'by' ${authorText} | Godwa Marathi Poem Platform`;
        
        // Clean description or use default
        const description = poem.description || poem.body_marathi?.substring(0, 150) + "..." || "Read this beautiful Marathi poem on Godwa.";
        const image = poem.poet?.image_url || '/favicon.ico';

        return {
            title: displayTitle,
            description: description,
            openGraph: {
                title: displayTitle,
                description: description,
                type: 'article',
                images: [image],
                siteName: 'Godwa Marathi Poem Platform',
            },
            twitter: {
                card: 'summary_large_image',
                title: displayTitle,
                description: description,
                images: [image],
            }
        };
    } catch (e) {
        return { 
            title: 'Godwa Marathi Poem Platform',
            description: 'Read beautiful Marathi poetry.'
        };
    }
}

export default function PoemLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
