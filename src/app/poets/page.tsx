import { Metadata } from "next";
import { PoetsClientView } from "./PoetsClientView";

export const metadata: Metadata = {
    title: "Marathi Poets & Writers Directory | Godwa",
    description:
        "Explore profiles, biographies, and complete works of classic and modern Marathi poets including Kusumagraj, Bahinabai, Grace, Suresh Bhat, and more.",
    keywords: [
        "Marathi poets directory",
        "Marathi writers",
        "Kusumagraj",
        "Bahinabai Chaudhari",
        "Suresh Bhat",
        "Grace",
        "Boli Bhasha poets",
        "Godwa poets directory",
    ],
    alternates: {
        canonical: "https://godwa.space/poets",
    },
    openGraph: {
        type: "website",
        url: "https://godwa.space/poets",
        title: "Marathi Poets & Writers Directory | Godwa",
        description:
            "Explore profiles, biographies, and complete works of classic and modern Marathi poets.",
        locale: "mr_IN",
        images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Godwa Poets Directory" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Marathi Poets & Writers Directory | Godwa",
        description: "Explore profiles, biographies, and complete works of classic and modern Marathi poets.",
        images: ["/icon-512.png"],
    },
};

export default function Page() {
    return <PoetsClientView />;
}
