"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

// Vocab entries are bilingual: Marathi word stays, meaning switches by language
const vocabEntries = [
    {
        word: "गोडवा",
        roman: "Godwaa",
        meaningEn: "Sweetness; the quality of being pleasant or melodious",
        meaningMr: "गोडपणा; आनंददायी किंवा सुरेल असण्याचा गुण",
    },
    {
        word: "दर्दी",
        roman: "Dardi",
        meaningEn: "A connoisseur; one who truly feels and understands art",
        meaningMr: "रसिक; जो कलेला मनापासून अनुभवतो आणि समजतो",
    },
    {
        word: "हुरहुर",
        roman: "Hurhur",
        meaningEn: "A restless longing; bittersweet anticipation for something far away",
        meaningMr: "व्याकूळ ओढ; दूर असलेल्या गोष्टीची मधुर-कडू प्रतीक्षा",
    },
    {
        word: "ओढ",
        roman: "Odh",
        meaningEn: "A pull; a deep yearning or attachment toward someone or something",
        meaningMr: "खेचणे; कोणाशी किंवा कशाशी तरी असलेली खोल आसक्ती",
    },
    {
        word: "वाट",
        roman: "Vaat",
        meaningEn: "A path, a way; also used poetically to mean waiting",
        meaningMr: "मार्ग, रस्ता; काव्यात 'प्रतीक्षा' या अर्थानेही वापरला जातो",
    },
];

const FEATURE_ICONS = ["🔤", "🔍", "📖", "🗣️", "🎭", "🎶"];

export function AboutUsClientView() {
    const { t, language } = useLanguage();
    const isMarathi = language === "devanagari";

    const features = [
        { icon: FEATURE_ICONS[0], title: t.about_feat_1_title, desc: t.about_feat_1_desc },
        { icon: FEATURE_ICONS[1], title: t.about_feat_2_title, desc: t.about_feat_2_desc },
        { icon: FEATURE_ICONS[2], title: t.about_feat_3_title, desc: t.about_feat_3_desc },
        { icon: FEATURE_ICONS[3], title: t.about_feat_4_title, desc: t.about_feat_4_desc },
        { icon: FEATURE_ICONS[4], title: t.about_feat_5_title, desc: t.about_feat_5_desc },
        { icon: FEATURE_ICONS[5], title: t.about_feat_6_title, desc: t.about_feat_6_desc },
    ];

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
                            <li><Link href="/" className="hover:text-maroon transition-colors">Godwa Space</Link></li>
                            <li>/</li>
                            <li className={`text-maroon font-bold ${isMarathi ? "font-marathi" : "font-english"}`}>
                                {isMarathi ? "आमच्या बद्दल" : "About"}
                            </li>
                        </ol>
                    </nav>

                    <h1 className={`text-5xl md:text-6xl font-bold text-foreground mb-3 leading-tight ${isMarathi ? "font-marathi" : "font-serif"}`}>
                        {t.about_title}
                    </h1>
                    <p className={`text-2xl text-gold font-semibold mb-8 tracking-wide ${isMarathi ? "font-marathi" : "font-english italic"}`}>
                        {t.about_subtitle}
                    </p>
                    <p className={`text-lg md:text-xl text-foreground/65 leading-relaxed max-w-2xl mx-auto mb-4 ${isMarathi ? "font-marathi" : "font-english"}`}>
                        {t.about_hero_desc_1}
                    </p>
                    <p className={`text-base text-foreground/55 leading-relaxed max-w-2xl mx-auto mb-4 ${isMarathi ? "font-marathi" : "font-english"}`}>
                        {t.about_hero_desc_2}
                    </p>
                    <p className={`text-base text-foreground/50 leading-relaxed max-w-xl mx-auto mb-10 ${isMarathi ? "font-marathi" : "font-english"}`}>
                        {t.about_hero_desc_3}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/explore"
                            className={`px-8 py-3 rounded-full bg-maroon text-white font-bold text-sm uppercase tracking-widest hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20 ${isMarathi ? "font-marathi" : "font-english"}`}
                        >
                            {t.about_btn_explore}
                        </Link>
                        <Link
                            href="/poets"
                            className={`px-8 py-3 rounded-full bg-white text-maroon border border-maroon/20 font-bold text-sm uppercase tracking-widest hover:bg-maroon/5 transition-all ${isMarathi ? "font-marathi" : "font-english"}`}
                        >
                            {t.about_btn_poets}
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
                            <h3 className={`font-bold text-xl text-foreground mb-2 ${isMarathi ? "font-marathi" : "font-serif"}`}>
                                {t.about_vision_preserve_title}
                            </h3>
                            <p className={`text-sm text-foreground/60 leading-relaxed ${isMarathi ? "font-marathi" : "font-english"}`}>
                                {t.about_vision_preserve_desc}
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-maroon/10 shadow-sm">
                            <div className="text-4xl mb-4">💡</div>
                            <h3 className={`font-bold text-xl text-foreground mb-2 ${isMarathi ? "font-marathi" : "font-serif"}`}>
                                {t.about_vision_understand_title}
                            </h3>
                            <p className={`text-sm text-foreground/60 leading-relaxed ${isMarathi ? "font-marathi" : "font-english"}`}>
                                {t.about_vision_understand_desc}
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-maroon/10 shadow-sm">
                            <div className="text-4xl mb-4">🌍</div>
                            <h3 className={`font-bold text-xl text-foreground mb-2 ${isMarathi ? "font-marathi" : "font-serif"}`}>
                                {t.about_vision_connect_title}
                            </h3>
                            <p className={`text-sm text-foreground/60 leading-relaxed ${isMarathi ? "font-marathi" : "font-english"}`}>
                                {t.about_vision_connect_desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Key Features ──────────────────────────────────────────────── */}
            <section className="py-24 bg-white border-b border-gold/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className={`text-xs font-bold uppercase tracking-widest text-maroon mb-2 block ${isMarathi ? "font-marathi" : "font-english"}`}>
                            {t.about_unique_tag}
                        </span>
                        <h2 className={`text-3xl md:text-4xl font-bold text-foreground ${isMarathi ? "font-marathi" : "font-serif"}`}>
                            {t.about_unique_title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((item, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-[#F9F7F5] border border-maroon/5 space-y-3">
                                <div className="text-3xl">{item.icon}</div>
                                <h3 className={`font-bold text-lg text-foreground ${isMarathi ? "font-marathi" : "font-serif"}`}>
                                    {item.title}
                                </h3>
                                <p className={`text-sm text-foreground/65 leading-relaxed ${isMarathi ? "font-marathi" : "font-english"}`}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mini Dictionary Section ───────────────────────────────────── */}
            <section className="py-20 bg-[#F9F7F5] border-b border-gold/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className={`text-xs font-bold uppercase tracking-widest text-gold mb-2 block ${isMarathi ? "font-marathi" : "font-english"}`}>
                        {t.about_vocab_tag}
                    </span>
                    <h2 className={`text-3xl font-bold text-foreground mb-4 ${isMarathi ? "font-marathi" : "font-serif"}`}>
                        {t.about_vocab_title}
                    </h2>
                    <p className={`text-foreground/60 text-sm max-w-xl mx-auto mb-12 ${isMarathi ? "font-marathi" : "font-english"}`}>
                        {t.about_vocab_desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {vocabEntries.map((v, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-maroon/10 shadow-sm">
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="font-marathi font-bold text-xl text-maroon">{v.word}</span>
                                    <span className="font-english text-xs text-foreground/40 italic">{v.roman}</span>
                                </div>
                                <p className={`text-xs text-foreground/70 leading-relaxed ${isMarathi ? "font-marathi" : "font-english"}`}>
                                    {isMarathi ? v.meaningMr : v.meaningEn}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
