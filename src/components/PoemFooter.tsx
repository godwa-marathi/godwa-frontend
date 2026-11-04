"use client";

import React from "react";
import Link from "next/link";
import { Globe, Instagram, Mail, Tag as TagIcon, Youtube } from "lucide-react";
import { LinkFields, PoemOut, PoetOut } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";

const isHttpUrl = (value?: string | null): value is string => {
    if (!value) return false;
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

/** Icon links for whichever of the four fields are set. Empty fields render nothing. */
export function LinkIcons({ links, owner }: { links: LinkFields; owner: string }) {
    const items: { key: string; href: string; label: string; icon: React.ReactNode; external: boolean }[] = [];
    if (isHttpUrl(links.instagram_url))
        items.push({ key: "ig", href: links.instagram_url, label: `Instagram: ${owner}`, icon: <Instagram className="w-4 h-4" />, external: true });
    if (isHttpUrl(links.youtube_url))
        items.push({ key: "yt", href: links.youtube_url, label: `YouTube: ${owner}`, icon: <Youtube className="w-4 h-4" />, external: true });
    if (links.contact_email)
        items.push({ key: "mail", href: `mailto:${links.contact_email}`, label: `Email: ${owner}`, icon: <Mail className="w-4 h-4" />, external: false });
    if (isHttpUrl(links.website_url))
        items.push({ key: "web", href: links.website_url, label: `Website: ${owner}`, icon: <Globe className="w-4 h-4" />, external: true });
    if (items.length === 0) return null;

    return (
        <ul className="flex items-center gap-2">
            {items.map((i) => (
                <li key={i.key}>
                    <a
                        href={i.href}
                        aria-label={i.label}
                        title={i.label}
                        {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex p-2 rounded-full border border-gold/20 text-maroon/70 hover:text-maroon hover:bg-gold/10 transition-colors"
                    >
                        {i.icon}
                    </a>
                </li>
            ))}
        </ul>
    );
}

/** Shown below the poem: tags, poet name and any contact/social links set by admin. */
export function PoemFooter({ poem, poet }: { poem: PoemOut; poet?: PoetOut | null }) {
    const { language } = useLanguage();
    const roman = language === "roman";
    const poetSource = poet ?? poem.poet;
    const poetName = roman ? poetSource?.name_roman || poetSource?.name : poetSource?.name;

    // Category first, then free tags.
    const tags = [...(poem.tags ?? [])].sort((a, b) => Number(b.is_category) - Number(a.is_category));
    const hasPoemLinks = !!(poem.instagram_url || poem.youtube_url || poem.contact_email || poem.website_url);
    const hasPoetLinks = !!(poet && (poet.instagram_url || poet.youtube_url || poet.contact_email || poet.website_url));

    if (tags.length === 0 && !poetName) return null;

    return (
        <footer aria-label="Poem details" className="mt-10 pt-6 border-t border-gold/15 space-y-4">
            {tags.length > 0 && (
                <ul className="flex flex-wrap items-center gap-2" aria-label="Tags">
                    <li aria-hidden className="text-gold"><TagIcon className="w-4 h-4" /></li>
                    {tags.map((tag) => (
                        <li key={tag.id}>
                            <Link
                                href={`/explore?tag=${encodeURIComponent(tag.slug)}`}
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors ${tag.is_category
                                    ? "bg-maroon text-white hover:bg-maroon/90"
                                    : "bg-gold/10 text-maroon hover:bg-gold/20"
                                    }`}
                            >
                                {tag.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {poetName && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-foreground/40 font-english italic">—</span>
                        {poetSource?.id ? (
                            <Link href={`/poets/${poetSource.id}`} prefetch={false} className="font-bold text-maroon hover:underline underline-offset-4">
                                {poetName}
                            </Link>
                        ) : (
                            <span className="font-bold text-maroon">{poetName}</span>
                        )}
                    </div>
                )}
                {hasPoetLinks && poet && <LinkIcons links={poet} owner={poetName ?? "poet"} />}
                {hasPoemLinks && <LinkIcons links={poem} owner="this poem" />}
            </div>
        </footer>
    );
}
