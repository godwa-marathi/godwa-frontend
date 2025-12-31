"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PoetCard } from "@/components/Cards";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PoetOut } from "@/lib/types";
import { Loader2, Search, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function PoetsPage() {
    const { data: poets, isLoading } = useQuery({
        queryKey: ["poets"],
        queryFn: () => api.get<PoetOut[]>("/api/poets/"),
    });

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block p-4 rounded-full bg-gold/5 text-gold mb-6 border border-gold/10">
                            <Users className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Celebrated Poets</h1>
                        <p className="text-foreground/60 font-english max-w-2xl mx-auto italic">
                            Explore the lives and legacies of the master weavers of Marathi verse.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="w-10 h-10 text-maroon animate-spin" />
                            <p className="text-gold font-english font-bold text-xs uppercase tracking-widest">Loading Literary Legends...</p>
                        </div>
                    ) : poets && poets.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
                        >
                            {poets.map((poet) => (
                                <PoetCard key={poet.id} poet={poet} />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gold/30">
                            <p className="text-foreground/40 font-english italic">No poets found in our archives yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
