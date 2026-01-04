"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PoemOut } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RekhtaReader } from "@/components/RekhtaReader";
import { Loader2, AlertCircle, ArrowLeft, User, Bookmark } from "lucide-react";
import Link from "next/link";

export default function PoemPage() {
    const { id } = useParams();
    const [isFocused, setIsFocused] = React.useState(false);

    const { data: poem, isLoading, error } = useQuery({
        queryKey: ["poem", id],
        queryFn: () => api.get<PoemOut>(`/api/poems/${id}`),
        enabled: !!id && id !== "0", // 0 is for demo
    });

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

    return (
        <main className="min-h-screen flex flex-col bg-[#F9F7F5]">
            <Navbar />

            <div className={`flex-1 w-full mx-auto pt-4 pb-20 px-4 md:px-8 transition-all duration-500 ${isFocused ? 'max-w-4xl' : 'max-w-7xl'}`}>
                {/* Top Controls: Back & Focus Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/explore" className="inline-flex items-center gap-1.5 text-foreground/40 hover:text-maroon transition-colors text-xs font-medium uppercase tracking-widest">
                        <ArrowLeft className="w-3 h-3" />
                        Back
                    </Link>
                    <button
                        onClick={() => setIsFocused(!isFocused)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-maroon hover:bg-maroon/5 px-3 py-1.5 rounded-full transition-colors"
                    >
                        {isFocused ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Exit Focus
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-foreground/20"></span>
                                Focus Mode
                            </>
                        )}
                    </button>
                </div>

                <div className={`grid grid-cols-1 ${isFocused ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-12 lg:gap-20 transition-all duration-500`}>
                    {/* Left Column: The Poem */}
                    <article className={`${isFocused ? 'w-full max-w-2xl mx-auto' : 'lg:col-span-7 xl:col-span-8'}`}>
                        <div className={`flex flex-col mb-6 ${isFocused ? 'items-center text-center' : 'items-center lg:items-start text-center lg:text-left'}`}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-marathi font-bold text-foreground leading-tight mb-2">
                                {poem.title}
                            </h1>
                            {/* Byline - Restore Link functionality */}
                            <div className="text-lg text-maroon/80 font-marathi font-medium">
                                <span className="text-foreground/40 mr-1.5 text-base font-english italic font-normal">by</span>
                                <Link
                                    href={`/poet/${poem.poet_id}`}
                                    className="hover:text-maroon hover:underline decoration-maroon/30 underline-offset-4 transition-all"
                                >
                                    {poem.poet?.name || "Traditional"}
                                </Link>
                            </div>
                        </div>

                        {/* Poem Reader */}
                        <div className="relative w-full">
                            <RekhtaReader poem={poem} />
                        </div>
                    </article>

                    {/* Right Column: Sidebar (Hidden in Focus Mode) */}
                    <aside className={`space-y-8 ${isFocused ? 'hidden' : 'lg:block lg:col-span-5 xl:col-span-4'}`}>

                        {/* 1. Poet Card (Now at TOP) */}
                        <div className="bg-white p-6 rounded-2xl border border-maroon/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className="w-20 h-20 rounded-full bg-main/5 border border-maroon/10 flex items-center justify-center text-maroon/40 mb-3 overflow-hidden">
                                    {poem.poet?.image_url ? (
                                        <img src={poem.poet.image_url} alt={poem.poet.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8" />
                                    )}
                                </div>
                                <h4 className="font-marathi font-bold text-xl mb-1 text-maroon">{poem.poet?.name || "Traditional"}</h4>
                                <Link
                                    href={`/poet/${poem.poet_id}`}
                                    className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-maroon transition-colors mt-2 border-b border-transparent hover:border-maroon"
                                >
                                    View Poet Profile
                                </Link>
                            </div>
                        </div>

                        {/* 2. About Poem */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/30 pl-1">About this Poem</h3>
                            <div className="bg-white/40 p-5 rounded-2xl border border-maroon/5 space-y-4">
                                {poem.description && (
                                    <p className="text-sm leading-relaxed text-foreground/80 font-english">
                                        {poem.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div className="bg-white p-3 rounded-lg border border-maroon/5">
                                        <div className="text-[9px] uppercase text-foreground/40 mb-1 font-bold">Genre</div>
                                        <div className="text-xs font-medium text-foreground/70">{poem.genre || "N/A"}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-maroon/5">
                                        <div className="text-[9px] uppercase text-foreground/40 mb-1 font-bold">Metre</div>
                                        <div className="text-xs font-medium text-foreground/70">{poem.chhanda_name || "Free Verse"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Suggestions */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/30 pl-1">Explore More</h3>
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

