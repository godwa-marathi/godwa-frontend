"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PoetCard } from "@/components/Cards";
import { AlphabetStrip } from "@/components/AlphabetStrip";
import { Pagination } from "@/components/Pagination";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { PaginatedPoetResponse } from "@/lib/types";
import {
    Loader2,
    Search,
    Users,
    LayoutGrid,
    List,
    ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// URL hash state helpers
// ---------------------------------------------------------------------------

function parseHash(hash: string): Record<string, string> {
    const params: Record<string, string> = {};
    const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!cleaned) return params;
    for (const pair of cleaned.split("&")) {
        const [key, val] = pair.split("=");
        if (key) params[decodeURIComponent(key)] = decodeURIComponent(val ?? "");
    }
    return params;
}

function buildHash(params: Record<string, string | number | null | undefined>): string {
    const parts: string[] = [];
    for (const [key, val] of Object.entries(params)) {
        if (val != null && val !== "") {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
        }
    }
    return parts.length ? `#${parts.join("&")}` : "";
}

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function PoetsPage() {
    const { t, language } = useLanguage();

    // ---- State (synced with URL hash) ----
    const [page, setPage] = React.useState(1);
    const [activeLetter, setActiveLetter] = React.useState<string | null>(null);
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [hashReady, setHashReady] = React.useState(false);

    // Read hash on mount
    React.useEffect(() => {
        const params = parseHash(window.location.hash);
        if (params.page) setPage(Number(params.page));
        if (params.letter) setActiveLetter(params.letter);
        if (params.sort === "asc" || params.sort === "desc") setSortOrder(params.sort);
        if (params.view === "grid" || params.view === "list") setViewMode(params.view);

        // Also read persisted view preference
        const savedView = localStorage.getItem("poets_view_mode") as "grid" | "list";
        if (!params.view && (savedView === "grid" || savedView === "list")) {
            setViewMode(savedView);
        }

        setHashReady(true);
    }, []);

    // Sync state -> hash
    React.useEffect(() => {
        if (!hashReady) return;
        const newHash = buildHash({
            page,
            letter: activeLetter,
            sort: sortOrder,
            view: viewMode,
        });
        // Replace without navigation
        window.history.replaceState(null, "", newHash || window.location.pathname);
    }, [page, activeLetter, sortOrder, viewMode, hashReady]);

    // ---- Build query params ----
    const queryParams = React.useMemo(() => {
        const p = new URLSearchParams({
            page: String(page),
            page_size: String(PAGE_SIZE),
            sort: sortOrder,
            language,
        });
        if (activeLetter) p.set("letter", activeLetter);
        return p.toString();
    }, [page, sortOrder, language, activeLetter]);

    // ---- Fetch paginated poets ----
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["poets-paginated", queryParams],
        queryFn: () => api.get<PaginatedPoetResponse>(`/api/poets/?${queryParams}`),
        placeholderData: (prev) => prev,
    });

    // ---- Client-side search filter on current page ----
    const displayPoets = React.useMemo(() => {
        if (!data?.items) return [];
        if (!searchQuery.trim()) return data.items;
        const q = searchQuery.trim().toLowerCase();
        return data.items.filter(
            (poet) =>
                poet.name.toLowerCase().includes(q) ||
                (poet.name_roman && poet.name_roman.toLowerCase().includes(q))
        );
    }, [data?.items, searchQuery]);

    // ---- Handlers ----
    const handleLetterClick = (letter: string | null) => {
        setActiveLetter(letter);
        setPage(1);
        setSearchQuery("");
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleViewModeChange = (mode: "grid" | "list") => {
        setViewMode(mode);
        localStorage.setItem("poets_view_mode", mode);
    };

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        setPage(1);
    };

    const availableLetters = data?.available_letters ?? [];

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* ---- Header ---- */}
                    <div className="flex flex-col lg:flex-row gap-5 justify-between lg:items-end mb-8 border-b border-gold/10 pb-7">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5 text-gold">
                                <Users className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] font-english">
                                    {language === "roman" ? "directory" : "सूची"}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                                {t.poets_title}
                            </h1>
                            <p className="text-foreground/50 text-xs font-english italic mt-1 max-w-md">
                                {t.poets_subtitle}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
                            {/* Search */}
                            <div className="relative group w-full sm:w-56">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 group-focus-within:text-maroon transition-colors" />
                                <input
                                    type="text"
                                    placeholder={language === "roman" ? "Search on this page…" : "या पानावर शोधा…"}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white/70 hover:bg-white border border-gold/15 rounded-full text-xs placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-maroon/10 focus:border-maroon/40 transition-all font-english backdrop-blur-sm shadow-sm"
                                />
                            </div>

                            {/* Sort */}
                            <button
                                onClick={toggleSort}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gold/5 border border-gold/15 hover:border-maroon/20 text-foreground/70 hover:text-maroon rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                            >
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                <span>
                                    {language === "roman"
                                        ? sortOrder === "asc"
                                            ? "A → Z"
                                            : "Z → A"
                                        : sortOrder === "asc"
                                        ? "अ → ज्ञ"
                                        : "ज्ञ → अ"}
                                </span>
                            </button>

                            <div className="h-6 w-px bg-gold/15 hidden sm:block" />

                            {/* View Toggle */}
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

                    {/* ---- Body: Alphabet Strip + Results ---- */}
                    <div className="flex gap-6 lg:gap-8">

                        {/* Alphabet Strip — vertical on desktop, hidden on mobile (shown above on mobile) */}
                        {availableLetters.length > 0 && (
                            <aside className="hidden lg:flex flex-col w-10 flex-shrink-0 pt-1">
                                <AlphabetStrip
                                    letters={availableLetters}
                                    activeLetter={activeLetter}
                                    onLetterClick={handleLetterClick}
                                    allLabel={t.poets_all_letters}
                                    language={language}
                                />
                            </aside>
                        )}

                        {/* Main content */}
                        <div className="flex-1 min-w-0">

                            {/* Alphabet Strip — horizontal on mobile */}
                            {availableLetters.length > 0 && (
                                <div className="lg:hidden mb-5 overflow-x-auto pb-2">
                                    <AlphabetStrip
                                        letters={availableLetters}
                                        activeLetter={activeLetter}
                                        onLetterClick={handleLetterClick}
                                        allLabel={t.poets_all_letters}
                                        language={language}
                                    />
                                </div>
                            )}

                            {/* Result meta bar */}
                            {data && (
                                <div className="flex items-center justify-between mb-3 text-[11px] font-english text-foreground/40">
                                    <span>
                                        {t.poets_showing}{" "}
                                        <span className="font-bold text-foreground/60">{data.total}</span>{" "}
                                        {t.poets_results}
                                        {activeLetter && (
                                            <> · <span className="text-maroon font-bold">{activeLetter}</span></>
                                        )}
                                        {searchQuery && (
                                            <> · {displayPoets.length} {language === "roman" ? "on this page" : "या पानावर"}</>
                                        )}
                                    </span>
                                    <span>
                                        {language === "roman" ? "Page" : "पृष्ठ"}{" "}
                                        <span className="font-bold text-foreground/60">{data.page}</span>{" "}
                                        {t.poets_page_of}{" "}
                                        <span className="font-bold text-foreground/60">{data.total_pages}</span>
                                    </span>
                                </div>
                            )}

                            {/* Loading state */}
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-4">
                                    <Loader2 className="w-10 h-10 text-maroon animate-spin" />
                                    <p className="text-gold font-english font-bold text-xs uppercase tracking-widest">
                                        {t.poets_loading}
                                    </p>
                                </div>
                            ) : displayPoets.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${viewMode}-${queryParams}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: isFetching ? 0.6 : 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className={
                                            viewMode === "grid"
                                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10"
                                                : "bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden"
                                        }
                                    >
                                        {displayPoets.map((poet) => (
                                            <PoetCard key={poet.id} poet={poet} viewMode={viewMode} />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gold/30">
                                    <p className="text-foreground/40 font-english italic">
                                        {t.poets_no_results}
                                    </p>
                                    {activeLetter && (
                                        <button
                                            onClick={() => handleLetterClick(null)}
                                            className="mt-4 text-xs text-maroon underline cursor-pointer"
                                        >
                                            {t.poets_all_letters}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {data && data.total_pages > 1 && !searchQuery && (
                                <Pagination
                                    currentPage={data.page}
                                    totalPages={data.total_pages}
                                    onPageChange={handlePageChange}
                                    prevLabel={t.poets_prev}
                                    nextLabel={t.poets_next}
                                    pageOfLabel={t.poets_page_of}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
