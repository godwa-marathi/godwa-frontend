"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PoemCard } from "@/components/Cards";
import { Search, SlidersHorizontal, ChevronRight, ChevronLeft } from "lucide-react";
import { PoemOut } from "@/lib/types";

const CATEGORIES = [
    "All", "Romantic", "Nature", "Patriotic", "Spiritual",
    "Social", "Inspirational", "Folklore", "Classical", "Modern"
];

// Mock data
const ALL_POEMS: PoemOut[] = [
    { id: 1, title: "सांजवळ", genre: "Romantic", poet_id: 1, body_marathi: "...", poet: { id: 1, name: "B.B. Borkar" }, status: "approved", words: [] },
    { id: 2, title: "कणा", genre: "Inspirational", poet_id: 2, body_marathi: "...", poet: { id: 2, name: "Kusumagraj" }, status: "approved", words: [] },
    { id: 3, title: "श्रावणमास", genre: "Nature", poet_id: 3, body_marathi: "...", poet: { id: 3, name: "Balakavi" }, status: "approved", words: [] },
    { id: 4, title: "गर्जा जयजयकार", genre: "Patriotic", poet_id: 2, body_marathi: "...", poet: { id: 2, name: "Kusumagraj" }, status: "approved", words: [] },
    { id: 5, title: "पसायदान", genre: "Spiritual", poet_id: 5, body_marathi: "...", poet: { id: 5, name: "Sant Dnyaneshwar" }, status: "approved", words: [] },
    { id: 6, title: "विठ्ठला तू", genre: "Spiritual", poet_id: 6, body_marathi: "...", poet: { id: 6, name: "Namdeo Dhasal" }, status: "approved", words: [] },
];

export default function ExplorePage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPoems = ALL_POEMS.filter(poem => {
        const matchesCategory = selectedCategory === "All" || poem.genre === selectedCategory;
        const matchesSearch = poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            poem.poet?.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-foreground">Explore Poetry</h1>
                        <p className="text-foreground/60 font-english mt-1">Discover the vast landscape of Marathi verse</p>
                    </div>

                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within:text-maroon transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by title or poet..."
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
                                {category}
                            </button>
                        ))}
                    </div>
                    {/* Subtle gradient indicators for scroll */}
                    <div className="absolute top-0 right-0 h-[calc(100%-1rem)] w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
                    <div className="absolute top-0 left-0 h-[calc(100%-1rem)] w-12 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden" />
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div className="text-sm font-english text-foreground/40 font-bold uppercase tracking-widest">
                        {filteredPoems.length} Results Found
                    </div>
                    <button className="flex items-center gap-2 text-sm font-english font-bold text-maroon uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredPoems.map((poem) => (
                        <PoemCard key={poem.id} poem={poem} />
                    ))}
                    {filteredPoems.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="text-gold mb-4 inline-block p-4 rounded-full bg-gold/5">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-foreground">No poems found</h3>
                            <p className="text-foreground/60 font-english mt-1">Try adjusting your filters or search query</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
