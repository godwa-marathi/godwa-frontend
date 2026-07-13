"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, User, ArrowRight, Quote } from "lucide-react";
import { PoemOut } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";

const AUTO_ADVANCE_MS = 6000;
const MAX_SLIDES = 5;

// Fisher–Yates shuffle — returns a new array, leaves the input untouched.
const shuffle = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

export const PopularPoemsSlider = ({ poems }: { poems: PoemOut[] }) => {
    const { t, language } = useLanguage();

    // Pick a random handful once per mount so the slider feels fresh on each visit.
    // Prefer approved poems that actually have a body to show.
    const slides = React.useMemo(() => {
        const candidates = poems.filter(
            (p) => (p.status === "approved" || !p.status) && p.body_marathi?.trim()
        );
        const pool = candidates.length > 0 ? candidates : poems;
        return shuffle(pool).slice(0, MAX_SLIDES);
    }, [poems]);

    const [index, setIndex] = React.useState(0);
    const [paused, setPaused] = React.useState(false);

    const count = slides.length;

    const goTo = React.useCallback(
        (next: number) => {
            if (count === 0) return;
            setIndex(((next % count) + count) % count);
        },
        [count]
    );

    // Auto-advance, pausing on hover/focus.
    React.useEffect(() => {
        if (paused || count <= 1) return;
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % count);
        }, AUTO_ADVANCE_MS);
        return () => clearInterval(id);
    }, [paused, count]);

    if (count === 0) return null;

    const poem = slides[index];
    const displayTitle = language === "roman" ? poem.title_roman || poem.title : poem.title;
    const displayBody = language === "roman" ? poem.body_roman || poem.body_marathi : poem.body_marathi;
    const displayPoetName =
        language === "roman"
            ? poem.poet?.name_roman || poem.poet?.name || t.poem_traditional
            : poem.poet?.name || t.poem_traditional;
    const bodyLines = displayBody.split("\n").filter((l) => l.trim()).slice(0, 4);

    return (
        <section
            className="py-24 bg-white"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-block px-3 py-1 rounded-full bg-maroon/5 text-maroon text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        {t.home_popular_tag}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                        {t.home_popular_title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-foreground/60 font-english">
                        {t.home_popular_subtitle}
                    </p>
                </div>

                <div className="relative">
                    {/* Slide */}
                    <div className="relative overflow-hidden rounded-3xl border border-gold/15 bg-gradient-to-br from-gold/[0.04] to-maroon/[0.03] shadow-sm">
                        {/* Decorative quote mark */}
                        <Quote className="absolute top-6 right-8 w-16 h-16 text-gold/10 rotate-180" aria-hidden />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={poem.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="p-8 md:p-14 min-h-[24rem] flex flex-col"
                            >
                                <div className="inline-block px-2 py-0.5 rounded bg-maroon/5 text-maroon text-[10px] font-bold uppercase tracking-widest w-fit mb-5">
                                    {poem.genre || "Collection"}
                                </div>

                                <Link href={`/poem/${poem.url_slug || poem.id}`} prefetch={false} className="group">
                                    <h3
                                        className={`text-2xl md:text-3xl font-bold text-foreground mb-6 group-hover:text-maroon transition-colors ${
                                            language === "roman" ? "font-english" : "font-marathi"
                                        }`}
                                    >
                                        {displayTitle}
                                    </h3>
                                </Link>

                                <div
                                    className={`flex-1 space-y-1.5 text-lg md:text-xl leading-relaxed text-foreground/75 ${
                                        language === "roman" ? "font-english" : "font-marathi"
                                    }`}
                                >
                                    {bodyLines.map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                    <span className="text-gold/60">…</span>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gold/10 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-maroon/5 flex items-center justify-center text-maroon overflow-hidden flex-shrink-0">
                                            {poem.poet?.image_url ? (
                                                <img
                                                    src={poem.poet.image_url}
                                                    alt={displayPoetName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-4 h-4" />
                                            )}
                                        </div>
                                        <span className="text-sm font-english font-medium text-foreground/80 truncate">
                                            {displayPoetName}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/poem/${poem.url_slug || poem.id}`}
                                        prefetch={false}
                                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-maroon font-english font-bold text-xs uppercase tracking-widest hover:gap-2.5 transition-all"
                                    >
                                        {t.home_read_poem}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => goTo(index - 1)}
                                aria-label="Previous poem"
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 w-11 h-11 rounded-full bg-white border border-gold/20 shadow-md flex items-center justify-center text-maroon transition-transform hover:scale-110 active:scale-95"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => goTo(index + 1)}
                                aria-label="Next poem"
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 w-11 h-11 rounded-full bg-white border border-gold/20 shadow-md flex items-center justify-center text-maroon transition-transform hover:scale-110 active:scale-95"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Dots */}
                {count > 1 && (
                    <div className="flex justify-center items-center gap-2.5 mt-8">
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Go to poem ${i + 1}`}
                                aria-current={i === index}
                                className={`h-2 rounded-full transition-all ${
                                    i === index ? "w-8 bg-maroon" : "w-2 bg-gold/30 hover:bg-gold/50"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
