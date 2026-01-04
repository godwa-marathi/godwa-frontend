"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PoemCard } from "@/components/Cards";
import { Search, SlidersHorizontal, ChevronRight, ChevronLeft } from "lucide-react";
import { PoemOut } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const CATEGORIES = [
    "All", "Romantic", "Nature", "Patriotic", "Spiritual",
    "Social", "Inspirational", "Folklore", "Classical", "Modern"
];

export default function ExplorePage() {
    const { t, language } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch approved poems from database
    const { data: allPoems, isLoading, error } = useQuery({
        queryKey: ["poems", "explore"],
        queryFn: () => api.get<PoemOut[]>("/api/poems"),
    });

    // Client-side filtering for better UX (can be moved to server-side later)
    const filteredPoems = React.useMemo(() => {
        if (!allPoems) return [];
        return allPoems.filter(poem => {
            const matchesCategory = selectedCategory === "All" || poem.genre === selectedCategory;
            const matchesSearch = poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                poem.poet?.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allPoems, selectedCategory, searchQuery]);

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-foreground">{t.explore_title}</h1>
                        <p className="text-foreground/60 font-english mt-1">{t.explore_subtitle}</p>
                    </div>

                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within:text-maroon transition-colors" />
                        <input
                            type="text"
                            placeholder={t.explore_search_placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gold/10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all font-english"
                        />
                    </div>
                </div>

                {/* Category Scroller */}
                <div className="relative mb-12">
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scroll-smooth">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-english font-semibold transition-all shadow-sm ${selectedCategory === category
                                    ? "bg-maroon text-white shadow-maroon/20 scale-105"
                                    : "bg-white text-foreground/60 border border-gold/10 hover:border-maroon/40 hover:text-maroon"
                                    }`}
                            >
                                {(t as any)[`cat_${category.toLowerCase()}`] || category}
                            </button>
                        ))}
                    </div>
                    {/* Subtle gradient indicators for scroll */}
                    <div className="absolute top-0 right-0 h-[calc(100%-1rem)] w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
                    <div className="absolute top-0 left-0 h-[calc(100%-1rem)] w-12 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden" />
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div className="text-sm font-english text-foreground/40 font-bold uppercase tracking-widest">
                        {filteredPoems.length} {t.explore_results_found}
                    </div>
                    <button className="flex items-center gap-2 text-sm font-english font-bold text-maroon uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        <SlidersHorizontal className="w-4 h-4" />
                        {t.explore_filter_btn}
                    </button>
                </div>

                {/* Results Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-80 rounded-3xl bg-gold/5 animate-pulse border border-gold/10" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center bg-red-50 rounded-3xl border border-red-100">
                        <div className="text-red-500 mb-4 inline-block p-4 rounded-full bg-red-100">
                            <Search className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground">Failed to load poems</h3>
                        <p className="text-foreground/60 font-english mt-1">Please try refreshing the page.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredPoems.map((poem) => (
                            <PoemCard key={poem.id} poem={poem} />
                        ))}
                        {filteredPoems.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <div className="text-gold mb-4 inline-block p-4 rounded-full bg-gold/5">
                                    <Search className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground">{t.explore_no_results_title}</h3>
                                <p className="text-foreground/60 font-english mt-1">{t.explore_no_results_desc}</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
