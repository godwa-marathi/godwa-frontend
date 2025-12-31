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
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <article className="flex-1 max-w-4xl mx-auto w-full pt-12 pb-24">
                <div className="px-4 mb-12">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-gold hover:text-maroon transition-colors text-xs font-bold uppercase tracking-widest mb-8 group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Explore
                    </Link>

                    <header className="text-center space-y-4">
                        <div className="inline-block px-3 py-1 rounded bg-maroon/5 text-maroon text-[10px] font-bold uppercase tracking-widest">
                            {poem.genre || "Classical Verse"}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-marathi font-bold text-foreground leading-tight">
                            {poem.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-english text-gold font-bold uppercase tracking-widest">Poet</div>
                                    <div className="text-sm font-marathi font-bold text-foreground">{poem.poet?.name || "Traditional"}</div>
                                </div>
                            </div>
                            {poem.chhanda_name && (
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                        <Bookmark className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-english text-gold font-bold uppercase tracking-widest">Metre</div>
                                        <div className="text-sm font-marathi font-bold text-foreground">{poem.chhanda_name}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                </div>

                <section className="bg-white/50 backdrop-blur-sm rounded-3xl border border-gold/10 py-12 md:py-20 shadow-2xl shadow-gold/5 mx-4">
                    <RekhtaReader poem={poem} />
                </section>
            </article>

            <Footer />
        </main>
    );
}
