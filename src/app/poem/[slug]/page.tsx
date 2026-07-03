"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PoemOut, PoetOut } from "@/lib/types";
import { Navbar, UserAvatar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RekhtaReader } from "@/components/RekhtaReader";
import { LikeButton } from "@/components/LikeButton";
import { Loader2, AlertCircle, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function PoemPage() {
    const { slug } = useParams();
    const [isFocused, setIsFocused] = React.useState(false);
    const { t, language } = useLanguage();

    const { data: poem, isLoading, error } = useQuery({
        queryKey: ["poem", slug],
        queryFn: () => {
            // Support both old ID format and new slug format for backward compatibility
            const endpoint = isNaN(Number(slug)) ? `/api/poems/slug/${slug}` : `/api/poems/${slug}`;
            return api.get<PoemOut>(endpoint);
        },
        enabled: !!slug && slug !== "0", // 0 is for demo
    });

    const { data: poets } = useQuery({
        queryKey: ["poets"],
        queryFn: () => api.get<PoetOut[]>("/api/poets/"),
    });

    const fullPoet = poets?.find(p => p.id === poem?.poet_id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-maroon animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !poem) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Poem Not Found</h1>
                    <p className="text-foreground/60 font-english mb-8">The poem you are looking for might have been moved or deleted.</p>
                    <Link href="/explore" className="px-6 py-2 bg-maroon text-white rounded-full font-english font-medium">
                        Back to Explore
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const displayTitle = language === 'roman' ? (poem.title_roman || poem.title) : poem.title;
    const displayPoetName = language === 'roman' ? (poem.poet?.name_roman || poem.poet?.name || t.poem_traditional) : (poem.poet?.name || t.poem_traditional);

    return (
        <main className="min-h-screen flex flex-col bg-[#F9F7F5]">
            <Navbar />

            <div className={`flex-1 w-full mx-auto pt-4 pb-20 px-4 md:px-8 transition-all duration-500 ${isFocused ? 'max-w-4xl' : 'max-w-7xl'}`}>
                {/* Top Controls: Back & Focus Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/explore" className="inline-flex items-center gap-1.5 text-foreground/40 hover:text-maroon transition-colors text-xs font-medium uppercase tracking-widest">
                        <ArrowLeft className="w-3 h-3 animate-in fade-in duration-300" />
                        {t.poem_back}
                    </Link>
                    <button
                        onClick={() => setIsFocused(!isFocused)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-maroon hover:bg-maroon/5 px-3 py-1.5 rounded-full transition-colors"
                    >
                        {isFocused ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {t.poem_exit_focus}
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-foreground/20"></span>
                                {t.poem_focus_mode}
                            </>
                        )}
                    </button>
                </div>

                <div className={`grid grid-cols-1 ${isFocused ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-12 lg:gap-20 transition-all duration-500`}>
                    {/* Left Column: The Poem */}
                    <article className={`${isFocused ? 'w-full max-w-2xl mx-auto' : 'lg:col-span-7 xl:col-span-8'}`}>
                        <div className={`flex flex-col mb-6 ${isFocused ? 'items-center text-center' : 'items-center lg:items-start text-center lg:text-left'}`}>
                            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2 ${language === 'roman' ? 'font-english' : 'font-marathi'}`}>
                                {language === 'roman' ? (
                                    <>
                                        {poem.title_roman || poem.title}
                                        {poem.title_roman && poem.title && (
                                            <span className="text-lg font-normal text-foreground/40 font-marathi ml-3 font-sans">({poem.title})</span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {poem.title}
                                        {poem.title_roman && (
                                            <span className="text-sm font-normal text-foreground/45 font-english ml-3 font-serif">({poem.title_roman})</span>
                                        )}
                                    </>
                                )}
                            </h1>
                            {/* Byline - Restore Link functionality */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2 w-full">
                                <div className="flex items-center gap-2 text-lg text-maroon/80 font-medium">
                                    <span className="text-foreground/40 text-base font-english italic font-normal">{t.poem_by}</span>
                                    <Link
                                        href={`/poets/${poem.poet_id}`}
                                        className={`inline-flex items-center gap-2 hover:text-maroon hover:underline decoration-maroon/30 underline-offset-4 transition-all ${language === 'roman' ? 'font-english' : 'font-marathi'}`}
                                    >
                                        {fullPoet?.image_url && (
                                            <span className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full border border-maroon/10 shadow-sm">
                                                <img
                                                    src={fullPoet.image_url}
                                                    alt={displayPoetName}
                                                    className="aspect-square h-full w-full object-cover"
                                                />
                                            </span>
                                        )}
                                        <span>
                                            {language === 'roman' ? (
                                                <>
                                                    {poem.poet?.name_roman || poem.poet?.name || t.poem_traditional}
                                                    {poem.poet?.name_roman && poem.poet?.name && (
                                                        <span className="text-xs font-normal text-foreground/40 font-marathi ml-1.5 font-sans">({poem.poet.name})</span>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {poem.poet?.name || t.poem_traditional}
                                                    {poem.poet?.name_roman && (
                                                        <span className="text-xs font-normal text-foreground/45 font-english ml-1.5 font-serif">({poem.poet.name_roman})</span>
                                                    )}
                                                </>
                                            )}
                                        </span>
                                    </Link>
                                </div>
                                <div className="h-4 w-px bg-gold/25 hidden lg:block" />
                                <LikeButton poemId={poem.id} initialLikeCount={poem.like_count} initialIsLiked={poem.is_liked} size="md" />
                            </div>

                            {/* Contributor Section */}
                            {poem.status === 'approved' && poem.contributed_by && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-foreground/50 font-english justify-center lg:justify-start">
                                    <span>Contributed by</span>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/5 border border-gold/10">
                                        <UserAvatar user={poem.contributed_by} size={18} />
                                        <span className="font-semibold text-foreground/70">
                                            {poem.contributed_by.display_name || poem.contributed_by.name}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Poem Reader */}
                        <div className="relative w-full">
                            <RekhtaReader poem={poem} />
                        </div>
                    </article>

                    {/* Right Column: Sidebar (Hidden in Focus Mode) */}
                    <aside className={`space-y-8 ${isFocused ? 'hidden' : 'block lg:col-span-5 xl:col-span-4'}`}>

                        {/* 1. Poet Card (Now at TOP) */}
                        <div className="bg-white p-6 rounded-2xl border border-maroon/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className="w-20 h-20 rounded-full bg-main/5 border border-maroon/10 flex items-center justify-center text-maroon/40 mb-3 overflow-hidden">
                                    {fullPoet?.image_url ? (
                                        <img src={fullPoet.image_url} alt={poem.poet?.name || ''} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8" />
                                    )}
                                </div>
                                <h4 className={`font-bold text-xl mb-1 text-maroon ${language === 'roman' ? 'font-english' : 'font-marathi'}`}>
                                    {language === 'roman' ? (
                                        <>
                                            {poem.poet?.name_roman || poem.poet?.name || t.poem_traditional}
                                            {poem.poet?.name_roman && poem.poet?.name && (
                                                <span className="text-xs font-normal text-foreground/40 font-marathi ml-1.5 font-sans">({poem.poet.name})</span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {poem.poet?.name || t.poem_traditional}
                                            {poem.poet?.name_roman && (
                                                <span className="text-xs font-normal text-foreground/45 font-english ml-1.5 font-serif">({poem.poet.name_roman})</span>
                                            )}
                                        </>
                                    )}
                                </h4>
                                {poem.poet && (
                                    <Link
                                        href={`/poets/${poem.poet.id}`}
                                        className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-maroon transition-colors mt-2 border-b border-transparent hover:border-maroon"
                                    >
                                        {t.poem_view_poet_profile}
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* 2. About Poem */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/30 pl-1">{t.poem_about_title}</h3>
                            <div className="bg-white/40 p-5 rounded-2xl border border-maroon/5 space-y-4">
                                {poem.description && (
                                    <p className="text-sm leading-relaxed text-foreground/80 font-english">
                                        {poem.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div className="bg-white p-3 rounded-lg border border-maroon/5">
                                        <div className="text-[9px] uppercase text-foreground/40 mb-1 font-bold">{t.poem_genre}</div>
                                        <div className="text-xs font-medium text-foreground/70">{poem.genre || "N/A"}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-maroon/5">
                                        <div className="text-[9px] uppercase text-foreground/40 mb-1 font-bold">{t.poem_metre}</div>
                                        <div className="text-xs font-medium text-foreground/70">{poem.chhanda_name || t.poem_free_verse}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Suggestions */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/30 pl-1">{t.poem_explore_more}</h3>
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <Link key={i} href="/explore" className="flex items-center justify-between p-3 bg-white hover:bg-white/80 border border-transparent hover:border-maroon/10 rounded-xl transition-all group cursor-pointer">
                                        <div>
                                            <div className="font-marathi font-bold text-sm group-hover:text-maroon transition-colors">
                                                रंग माझा वेगळा
                                            </div>
                                            <div className="text-[10px] text-foreground/40">Suresh Bhat</div>
                                        </div>
                                        <ArrowLeft className="w-3 h-3 rotate-180 text-foreground/20 group-hover:text-maroon transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </main>
    );
}

