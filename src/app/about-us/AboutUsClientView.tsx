"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const features = [
    {
        icon: "🔤",
        title: "Read in Devanagari or Roman",
        desc: "Every poem is available in Marathi (Devanagari) and Roman Marathi transliteration. Switch between them instantly—no script barrier.",
    },
    {
        icon: "🔍",
        title: "Word-by-Word Meanings",
        desc: "Tap any word to instantly see its meaning. No dictionary needed—the context is right inside the poem.",
    },
    {
        icon: "📖",
        title: "Contextual Interpretation",
        desc: "Instead of dictionary definitions, Godwa explains words as they are actually used in the poem—what the poet intended to express.",
    },
    {
        icon: "🗣️",
        title: "Boli Bhasha Coverage",
        desc: "Classical Marathi, Sanskrit vocabulary, regional dialects, historical expressions—Godwa covers them all so no word is left unexplained.",
    },
    {
        icon: "🎭",
        title: "Poet Profiles",
        desc: "Learn about the poets—their lives, their eras, and their literary contributions—alongside their work.",
    },
    {
        icon: "🎶",
        title: "Chhanda (Metre) Information",
        desc: "Understand the poetic metre of each poem. Explore poems by genre, mood, and Chhanda.",
    },
];

const vocab = [
    { word: "गोडवा", roman: "Godwaa", meaning: "Sweetness; the quality of being pleasant or melodious" },
    { word: "दर्दी", roman: "Dardi", meaning: "A connoisseur; one who truly feels and understands art" },
    { word: "हुरहुर", roman: "Hurhur", meaning: "A restless longing; bittersweet anticipation for something far away" },
    { word: "ओढ", roman: "Odh", meaning: "A pull; a deep yearning or attachment toward someone or something" },
    { word: "वाट", roman: "Vaat", meaning: "A path, a way; also used poetically to mean waiting" },
];

export function AboutUsClientView() {
    return (
        <main className="min-h-screen flex flex-col bg-[#F9F7F5]">
            <Navbar />

            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-white border-b border-gold/10 py-20 md:py-32">
                <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-maroon/5 blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <nav aria-label="breadcrumb" className="flex justify-center mb-8">
                        <ol className="flex items-center gap-2 text-[11px] font-english text-foreground/40 uppercase tracking-widest">
                            <li><Link href="/" className="hover:text-maroon transition-colors">Godwa</Link></li>
                            <li>/</li>
                            <li className="text-maroon font-bold">About</li>
                        </ol>
                    </nav>

                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-3 leading-tight">
                        About Godwa
                    </h1>
                    <p className="font-marathi text-2xl text-gold font-semibold mb-8 tracking-wide">
                        गोडवा — मराठी कवितेचे डिजिटल घर
                    </p>
                    <p className="text-lg md:text-xl text-foreground/65 font-english leading-relaxed max-w-2xl mx-auto mb-3">
                        <strong>Godwa</strong> is a digital home for Marathi poetry.
                    </p>
                    <p className="text-base text-foreground/55 font-english leading-relaxed max-w-2xl mx-auto mb-10">
                        Our mission is to preserve, organize, and make Marathi poetry
                        accessible to everyone — whether you are a lifelong Marathi reader,
                        someone learning the language, or simply curious about Maharashtra's
                        rich literary heritage.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/explore"
                            className="px-8 py-3 rounded-full bg-maroon text-white font-english font-bold text-sm uppercase tracking-widest hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20"
                        >
                            Explore Poems
                        </Link>
                        <Link
                            href="/poets"
                            className="px-8 py-3 rounded-full bg-white text-maroon border border-maroon/20 font-english font-bold text-sm uppercase tracking-widest hover:bg-maroon/5 transition-all"
                        >
                            Poets Directory
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Core Value / Vision ────────────────────────────────────────── */}
            <section className="py-20 bg-[#F9F7F5] border-b border-gold/10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-8 rounded-3xl border border-maroon/10 shadow-sm">
                            <div className="text-4xl mb-4">📜</div>
                            <h3 className="font-serif font-bold text-xl text-foreground mb-2">Preserve</h3>
                            <p className="text-sm text-foreground/60 font-english leading-relaxed">
                                Documenting classic and contemporary Marathi poems, regional dialects, and rare literary works before they are lost to time.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-maroon/10 shadow-sm">
                            <div className="text-4xl mb-4">💡</div>
                            <h3 className="font-serif font-bold text-xl text-foreground mb-2">Understand</h3>
                            <p className="text-sm text-foreground/60 font-english leading-relaxed">
                                Providing word-by-word meanings, contextual interpretations, and Boli Bhasha explanations directly within the text.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-maroon/10 shadow-sm">
                            <div className="text-4xl mb-4">🌍</div>
                            <h3 className="font-serif font-bold text-xl text-foreground mb-2">Connect</h3>
                            <p className="text-sm text-foreground/60 font-english leading-relaxed">
                                Enabling readers worldwide—regardless of script fluency—to read Marathi poetry in Devanagari or Roman transliteration.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Key Features ──────────────────────────────────────────────── */}
            <section className="py-24 bg-white border-b border-gold/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-maroon mb-2 block">
                            Features
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            What Makes Godwa Unique?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((item, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-[#F9F7F5] border border-maroon/5 space-y-3">
                                <div className="text-3xl">{item.icon}</div>
                                <h3 className="font-serif font-bold text-lg text-foreground">{item.title}</h3>
                                <p className="text-sm text-foreground/65 font-english leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mini Dictionary Section ───────────────────────────────────── */}
            <section className="py-20 bg-[#F9F7F5] border-b border-gold/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">
                        Literary Vocabulary
                    </span>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                        The Words Behind Godwa
                    </h2>
                    <p className="text-foreground/60 font-english text-sm max-w-xl mx-auto mb-12">
                        Marathi literature is rich with expressive words that carry deep emotional and cultural nuance. Here are a few examples:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {vocab.map((v, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-maroon/10 shadow-sm">
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="font-marathi font-bold text-xl text-maroon">{v.word}</span>
                                    <span className="font-english text-xs text-foreground/40 italic">{v.roman}</span>
                                </div>
                                <p className="text-xs text-foreground/70 font-english leading-relaxed">{v.meaning}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
