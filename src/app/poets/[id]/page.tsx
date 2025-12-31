"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PoemCard } from "@/components/Cards";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PoetOut, PoemOut } from "@/lib/types";
import { Loader2, User, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function PoetProfilePage() {
    const { id } = useParams();

    // Fetch all poets to find this one (since there's no single poet API)
    const { data: poets, isLoading: loadingPoets } = useQuery({
        queryKey: ["poets"],
        queryFn: () => api.get<PoetOut[]>("/api/poets/"),
    });

    const poet = poets?.find(p => p.id === Number(id));

    // Fetch poems by this poet
    const { data: poems, isLoading: loadingPoems } = useQuery({
        queryKey: ["poets", id, "poems"],
        queryFn: () => api.get<PoemOut[]>(`/api/poems/?poet=${id}`),
        enabled: !!id,
    });

    if (loadingPoets && !poet) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-10 h-10 text-maroon animate-spin" />
                </div>
            </div>
        );
    }

    if (!poet) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center py-24 bg-white m-8 rounded-3xl border border-dashed border-gold/30">
                    <BookOpen className="w-12 h-12 text-gold/20 mb-4" />
                    <h1 className="text-2xl font-serif font-bold text-foreground">Poet Not Found</h1>
                    <p className="text-foreground/40 font-english mt-2">The person you are looking for has not yet reached our archives.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Poet Header / Bio */}
            <section className="relative py-24 overflow-hidden border-b border-gold/10">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 -skew-x-12 translate-x-1/2 -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                        {/* Image */}
                        <div className="relative">
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl border-2 border-gold/20 p-2 overflow-hidden bg-white shadow-xl">
                                <div className="w-full h-full rounded-2xl overflow-hidden bg-gold/5 flex items-center justify-center">
                                    {poet.image_url ? (
                                        <img src={poet.image_url} alt={poet.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-20 h-20 text-gold/20" />
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-maroon text-white p-4 rounded-2xl shadow-xl flex flex-col items-center">
                                <span className="text-2xl font-bold font-serif">{poems?.length || 0}</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest">Works</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block px-3 py-1 rounded-full bg-maroon/5 text-maroon text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                                Grand Master
                            </div>
                            <h1 className="text-5xl md:text-6xl font-marathi font-bold text-foreground mb-4">
                                {poet.name}
                            </h1>
                            {poet.life_span && (
                                <p className="text-gold font-english font-bold text-sm tracking-[0.3em] uppercase mb-8">
                                    — {poet.life_span} —
                                </p>
                            )}

                            <div className="relative pt-4">
                                <Quote className="absolute -top-4 -left-8 w-12 h-12 text-gold/10 -z-10" />
                                <p className="text-lg md:text-xl text-foreground/80 font-marathi leading-relaxed italic max-w-2xl">
                                    {poet.bio || "His verses continue to echo in the heart of Marathi literature, bridging generations with timeless wisdom."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Poet's Works */}
            <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <BookOpen className="w-6 h-6 text-maroon" />
                        <h2 className="text-2xl font-serif font-bold text-foreground">Authored Works</h2>
                        <div className="flex-1 h-px bg-gold/10" />
                    </div>

                    {loadingPoems ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 rounded-3xl bg-gold/5 animate-pulse" />
                            ))}
                        </div>
                    ) : poems && poems.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {poems.map((poem) => (
                                <PoemCard key={poem.id} poem={poem} />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-gold/5 rounded-3xl border border-gold/10">
                            <p className="text-foreground/40 font-english italic">No poems by this poet found in the selected collection.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
