"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PoetCard } from "@/components/Cards";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { PaginatedPoetResponse } from "@/lib/types";
import { Loader2, Search, Users, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

export default function PoetsPage() {
    const { t, language } = useLanguage();
    // GET /api/poets/ returns a paginated envelope ({ items, total, ... }),
    // so read the poets off `.items`.
    const { data: poetsData, isLoading } = useQuery({
        queryKey: ["poets"],
        queryFn: () => api.get<PaginatedPoetResponse>("/api/poets/"),
    });
    const poets = poetsData?.items;

    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

    React.useEffect(() => {
        const savedView = localStorage.getItem("poets_view_mode") as 'grid' | 'list';
        if (savedView === 'grid' || savedView === 'list') {
            setViewMode(savedView);
        }
    }, []);

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode);
        localStorage.setItem("poets_view_mode", mode);
    };

    const filteredAndSortedPoets = React.useMemo(() => {
        if (!poets) return [];

        let result = poets.filter((poet) => {
            const query = searchQuery.trim().toLowerCase();
            const nameMatch = poet.name.toLowerCase().includes(query) ||
                (poet.name_roman && poet.name_roman.toLowerCase().includes(query));
            const bioMatch = poet.bio && poet.bio.toLowerCase().includes(query);
            return !query || nameMatch || bioMatch;
        });

        result.sort((a, b) => {
            const nameA = language === 'roman' ? (a.name_roman || a.name) : a.name;
            const nameB = language === 'roman' ? (b.name_roman || b.name) : b.name;
            const locale = language === 'devanagari' ? 'mr' : 'en';

            if (sortOrder === 'asc') {
                return nameA.localeCompare(nameB, locale);
            } else {
                return nameB.localeCompare(nameA, locale);
            }
        });

        return result;
    }, [poets, searchQuery, sortOrder, language]);

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header: Left-aligned and concise title with sleek controls */}
                    <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-end mb-12 border-b border-gold/10 pb-8">
                        {/* Title and Subtitle */}
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-gold">
                                <Users className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] font-english">
                                    {language === 'roman' ? 'directory' : 'सूची'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                                {t.poets_title}
                            </h1>
                            <p className="text-foreground/50 text-xs font-english italic mt-1 max-w-md">
                                {t.poets_subtitle}
                            </p>
                        </div>

                        {/* Sleek controls */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                            {/* Smaller, creative search bar */}
                            <div className="relative group w-full sm:w-60">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 group-focus-within:text-maroon transition-colors" />
                                <input
                                    type="text"
                                    placeholder={language === 'roman' ? "Search..." : "शोधा..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white/65 hover:bg-white/90 border border-gold/15 rounded-full text-xs placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-maroon/10 focus:border-maroon transition-all font-english backdrop-blur-sm shadow-sm"
                                />
                            </div>

                            {/* Sort Button */}
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gold/5 border border-gold/15 hover:border-maroon/20 text-foreground/80 hover:text-maroon rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                            >
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                <span>
                                    {language === 'roman'
                                        ? (sortOrder === 'asc' ? "A → Z" : "Z → A")
                                        : (sortOrder === 'asc' ? "अ → ज्ञ" : "ज्ञ → अ")
                                    }
                                </span>
                            </button>

                            <div className="h-6 w-px bg-gold/15 hidden sm:block" />

                            {/* Layout Toggle */}
                            <div className="inline-flex p-0.5 bg-white rounded-full border border-gold/15 shadow-sm">
                                <button
                                    onClick={() => handleViewModeChange("grid")}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                                        viewMode === "grid"
                                            ? "bg-maroon text-white shadow-sm font-semibold"
                                            : "text-foreground/60 hover:text-foreground hover:bg-gold/5"
                                    }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleViewModeChange("list")}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                                        viewMode === "list"
                                            ? "bg-maroon text-white shadow-sm font-semibold"
                                            : "text-foreground/60 hover:text-foreground hover:bg-gold/5"
                                    }`}
                                    title="List View"
                                >
                                    <List className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="w-10 h-10 text-maroon animate-spin" />
                            <p className="text-gold font-english font-bold text-xs uppercase tracking-widest">{t.poets_loading}</p>
                        </div>
                    ) : poets && poets.length > 0 ? (
                        <>
                            {/* Search Results count indicator */}
                            {searchQuery && (
                                <div className="text-xs text-foreground/40 font-bold font-english uppercase tracking-widest mb-6">
                                    {filteredAndSortedPoets.length} {language === 'roman' ? "results found" : "कवी सापडले"}
                                </div>
                            )}

                            {filteredAndSortedPoets.length > 0 ? (
                                <motion.div
                                    key={`${viewMode}-${sortOrder}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={viewMode === 'grid' 
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
                                        : "flex flex-col gap-6 max-w-4xl mx-auto"
                                    }
                                >
                                    {filteredAndSortedPoets.map((poet) => (
                                        <PoetCard key={poet.id} poet={poet} viewMode={viewMode} />
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gold/30">
                                    <p className="text-foreground/40 font-english italic">
                                        {language === 'roman' ? "No poets match your search query" : "तुमच्या निकषांशी जुळणारे कवी सापडले नाहीत"}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gold/30">
                            <p className="text-foreground/40 font-english italic">{t.poets_no_results}</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
