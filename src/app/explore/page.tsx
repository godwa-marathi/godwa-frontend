import { Metadata } from "next";
import { ExploreClientView } from "./ExploreClientView";

export const metadata: Metadata = {
    title: "Explore Marathi Poems & Kavita Collections | Godwa",
    description:
        "Browse and discover authentic Marathi poetry categorized by genre, mood, and legendary poets like Kusumagraj and Bahinabai with word-by-word meanings and Roman transliteration.",
    keywords: [
        "Explore Marathi poems",
        "Marathi kavita list",
        "Marathi poetry collection",
        "Boli Bhasha poems",
        "Marathi classical poems",
        "Godwa explore",
    ],
    alternates: {
        canonical: "https://godwa.space/explore",
    },
    openGraph: {
        type: "website",
        url: "https://godwa.space/explore",
        title: "Explore Marathi Poems & Kavita Collections | Godwa",
        description:
            "Browse and discover authentic Marathi poetry categorized by genre, mood, and legendary poets.",
        locale: "mr_IN",
        images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Godwa Explore" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Explore Marathi Poems & Kavita Collections | Godwa",
        description: "Browse and discover authentic Marathi poetry on Godwa.",
        images: ["/icon-512.png"],
    },
};

export default function Page() {
    return <ExploreClientView />;
}
