import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Godwa – Marathi Poetry, Meanings, Roman Transliteration & Literary Dictionary",
    description:
        "Godwa is an AI-assisted Marathi poetry platform where readers can explore poems with word-by-word meanings, contextual explanations, Roman transliteration, poet profiles, and Chhanda information. Discover, understand, and preserve Marathi literature.",
    keywords: [
        "Marathi poetry",
        "Marathi poems",
        "Marathi kavita",
        "Marathi literature",
        "Marathi dictionary",
        "Marathi word meanings",
        "Marathi vocabulary",
        "Roman Marathi",
        "Marathi transliteration",
        "Boli Bhasha",
        "Marathi poets",
        "Kusumagraj",
        "Bahinabai",
        "Grace",
        "Marathi Chhanda",
        "Marathi metre",
        "Godwa",
        "गोडवा",
    ],
    alternates: {
        canonical: "https://godwa.space/about-us",
    },
    openGraph: {
        title: "Godwa – Marathi Poetry, Meanings, Roman Transliteration & Literary Dictionary",
        description:
            "Godwa is an AI-assisted Marathi poetry platform where readers can explore poems with word-by-word meanings, contextual explanations, Roman transliteration, poet profiles, and Chhanda information.",
        url: "https://godwa.space/about-us",
        siteName: "Godwa",
        locale: "mr_IN",
        type: "website",
        images: [
            {
                url: "https://godwa.space/icon-512.png",
                width: 512,
                height: 512,
                alt: "Godwa – Marathi Poetry Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Godwa – Marathi Poetry for Everyone",
        description:
            "Godwa is an AI-assisted Marathi poetry platform where readers can explore poems with word-by-word meanings, contextual explanations, Roman transliteration, and Chhanda information.",
        images: ["https://godwa.space/icon-512.png"],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://godwa.space/#organization",
            name: "Godwa",
            alternateName: ["गोडवा", "Godwa Marathi Poetry"],
            url: "https://godwa.space",
            logo: {
                "@type": "ImageObject",
                url: "https://godwa.space/icon-512.png",
                width: 512,
                height: 512,
            },
            description:
                "Godwa is a digital home for Marathi poetry. Our mission is to preserve, organize, and make Marathi poetry accessible to everyone—whether you are a lifelong Marathi reader, someone learning the language, or simply curious about Maharashtra's rich literary heritage.",
            foundingDate: "2024",
            knowsAbout: [
                "Marathi poetry",
                "Marathi literature",
                "Boli Bhasha",
                "Devanagari script",
                "Roman transliteration",
                "Marathi vocabulary",
                "Chhanda",
                "Marathi metre",
            ],
        },
        {
            "@type": "WebSite",
            "@id": "https://godwa.space/#website",
            url: "https://godwa.space",
            name: "Godwa – Marathi Poetry Platform",
            description:
                "Godwa is an AI-assisted Marathi poetry platform with word-by-word meanings, Roman transliteration, and Boli Bhasha vocabulary.",
            publisher: { "@id": "https://godwa.space/#organization" },
            potentialAction: {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://godwa.space/explore?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
            },
            inLanguage: ["mr", "en"],
        },
        {
            "@type": "WebPage",
            "@id": "https://godwa.space/about-us#webpage",
            url: "https://godwa.space/about-us",
            name: "About Godwa – Marathi Poetry, Meanings & Roman Transliteration",
            isPartOf: { "@id": "https://godwa.space/#website" },
            about: { "@id": "https://godwa.space/#organization" },
            breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Godwa", item: "https://godwa.space" },
                    { "@type": "ListItem", position: 2, name: "About", item: "https://godwa.space/about-us" },
                ],
            },
        },
        {
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: "What is Godwa?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Godwa is a digital home for Marathi poetry. Our mission is to preserve, organize, and make Marathi poetry accessible to everyone—whether you are a lifelong Marathi reader, someone learning the language, or simply curious about Maharashtra's rich literary heritage.",
                    },
                },
                {
                    "@type": "Question",
                    name: "Can I read Marathi poems in Roman script on Godwa?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. Every poem on Godwa can be read in Roman Marathi transliteration, making it accessible to readers who are not familiar with Devanagari script. You can switch between scripts instantly.",
                    },
                },
                {
                    "@type": "Question",
                    name: "What is Boli Bhasha and how does Godwa cover it?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Boli Bhasha refers to regional and colloquial dialects of Marathi—words used in everyday speech across Maharashtra that may not appear in standard dictionaries. Godwa is building a comprehensive vocabulary of these words so readers can understand their meaning in context.",
                    },
                },
                {
                    "@type": "Question",
                    name: "What is Chhanda on Godwa?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Chhanda refers to the poetic metre—the rhythmic structure of a poem. Godwa identifies and displays the Chhanda for each poem so readers can understand and appreciate its musical and structural form.",
                    },
                },
                {
                    "@type": "Question",
                    name: "How can I contribute to Godwa?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "If you have poems, manuscripts, or suggestions, you can contribute through Godwa's submit page. All contributions are reviewed before being published, ensuring quality and accuracy.",
                    },
                },
            ],
        },
    ],
};

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

export default function AboutPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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
                        <p className="text-base text-foreground/50 font-english leading-relaxed max-w-xl mx-auto mb-10">
                            We believe that beautiful poetry should never remain inaccessible
                            because of difficult vocabulary, unfamiliar dialects, or script barriers.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/explore"
                                className="px-8 py-3 rounded-full bg-maroon text-white font-english font-bold text-sm uppercase tracking-widest hover:bg-maroon/90 transition-all shadow-lg shadow-maroon/20"
                            >
                                Explore Poems
                            </Link>
                            <Link
                                href="/submit"
                                className="px-8 py-3 rounded-full border border-maroon/30 text-maroon font-english font-bold text-sm uppercase tracking-widest hover:bg-maroon/5 transition-all"
                            >
                                Contribute
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── What Makes Godwa Different ───────────────────── */}
                <section className="py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="what-makes-godwa-different">
                    <div className="text-center mb-16">
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Our Approach</div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-5">
                            What makes Godwa different?
                        </h2>
                        <p className="text-foreground/60 font-english max-w-2xl mx-auto leading-relaxed">
                            Godwa is not just a collection of poems. Every poem is carefully
                            reviewed and enriched so readers can explore its meaning in depth.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gold/10 p-8 md:p-10 mb-10">
                        <h3 className="font-serif font-bold text-xl text-foreground mb-6">
                            For every poem, readers can:
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Read in Marathi (Devanagari)",
                                "Read in Roman Marathi transliteration",
                                "Understand difficult words instantly",
                                "View contextual meanings instead of simple dictionary translations",
                                "Learn about the poet",
                                "Explore poems by genre, mood, and poetic metre (Chhanda)",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 font-english text-sm text-foreground/70 leading-relaxed">
                                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-maroon/10 text-maroon flex items-center justify-center text-xs font-bold">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-sm font-english text-foreground/50 italic">
                            Our goal is to make Marathi poetry enjoyable for beginners as well as experienced literature enthusiasts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f) => (
                            <div key={f.title} className="bg-white rounded-2xl border border-gold/10 p-6 hover:border-maroon/20 hover:shadow-md hover:shadow-maroon/5 transition-all">
                                <span className="text-2xl mb-4 block">{f.icon}</span>
                                <h3 className="font-serif font-bold text-foreground text-base mb-2">{f.title}</h3>
                                <p className="text-sm font-english text-foreground/60 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Making Marathi Accessible ────────────────────── */}
                <section className="bg-white border-y border-gold/10 py-20 md:py-28" id="making-marathi-accessible">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Accessibility</div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 leading-snug">
                                    Making Marathi Poetry <span className="text-maroon">Accessible</span>
                                </h2>
                                <p className="text-foreground/70 font-english leading-relaxed mb-5">
                                    Many beautiful Marathi poems remain difficult to understand because they contain:
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Classical Marathi",
                                        "Sanskrit vocabulary",
                                        "Regional dialects (Boli Bhasha)",
                                        "Historical expressions",
                                        "Literary symbolism",
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-3 font-english text-sm text-foreground/70">
                                            <span className="w-1.5 h-1.5 rounded-full bg-maroon/40 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-foreground/70 font-english leading-relaxed">
                                    Godwa helps bridge this gap by providing AI-assisted linguistic
                                    enrichment followed by human review, ensuring that readers can
                                    appreciate both the literal and contextual meaning of every poem.
                                </p>
                            </div>

                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Beyond Translation</div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 leading-snug">
                                    Beyond <span className="text-maroon">Translation</span>
                                </h2>
                                <div className="bg-maroon rounded-2xl p-7 text-white mb-6">
                                    <p className="font-marathi text-xl leading-relaxed text-white/90 mb-4">
                                        शब्दाचा अर्थ संदर्भाशिवाय अपूर्ण असतो.
                                    </p>
                                    <p className="font-english italic text-white/60 text-sm">
                                        "A word's meaning is incomplete without its context."
                                    </p>
                                </div>
                                <p className="text-foreground/70 font-english leading-relaxed mb-4">
                                    A word rarely has just one meaning. Its interpretation changes
                                    depending on the poem, emotion, and context.
                                </p>
                                <p className="text-foreground/70 font-english leading-relaxed">
                                    Instead of providing only dictionary definitions, Godwa aims to
                                    explain words as they are actually used in literature — allowing
                                    readers to understand not only what a word means, but also what
                                    the poet intended to express.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Boli Bhasha Vocabulary ───────────────────────── */}
                <section className="py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="marathi-vocabulary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Living Dictionary</div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 leading-snug">
                                Building the Largest Marathi <span className="text-maroon">Literary Vocabulary</span>
                            </h2>
                            <p className="text-foreground/70 font-english leading-relaxed mb-5">
                                One of our long-term goals is to build one of the most comprehensive
                                digital vocabularies of Marathi. This includes:
                            </p>
                            <ul className="space-y-3 mb-6">
                                {[
                                    "Standard Marathi words",
                                    "Classical literary vocabulary",
                                    "Rare words",
                                    "Regional dialects (Boli Bhasha)",
                                    "Idioms and expressions",
                                    "Poetic usages",
                                    "Contextual meanings from literature",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 font-english text-sm text-foreground/70">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-foreground/60 font-english text-sm leading-relaxed italic">
                                Over time, every reviewed poem helps expand this living knowledge base.
                            </p>
                        </div>

                        {/* Sample vocabulary words */}
                        <div className="space-y-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-5">Sample — Boli Bhasha Words</p>
                            {vocab.map((w) => (
                                <div key={w.word} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-lg font-marathi font-bold">
                                        अ
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-0.5">
                                            <span className="font-marathi font-bold text-maroon text-lg">{w.word}</span>
                                            <span className="font-english italic text-foreground/35 text-sm">{w.roman}</span>
                                        </div>
                                        <p className="font-english text-sm text-foreground/60 leading-relaxed">{w.meaning}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Technology ───────────────────────────────────── */}
                <section className="bg-white border-y border-gold/10 py-20 md:py-28" id="technology">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-4">How It Works</div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-5">
                                Powered by Technology, <span className="text-maroon">Guided by Literature</span>
                            </h2>
                            <p className="text-foreground/60 font-english max-w-2xl mx-auto leading-relaxed">
                                Godwa uses modern technology to preserve literature rather than replace it.
                                Technology assists the process, while literature remains at the center.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {[
                                { icon: "📷", title: "OCR", desc: "Digitizing printed poems from physical books and manuscripts" },
                                { icon: "🤖", title: "AI Enrichment", desc: "AI-assisted word meanings and contextual interpretation" },
                                { icon: "🔤", title: "Transliteration", desc: "Automatic Roman script conversion for every poem" },
                                { icon: "🎵", title: "Chhanda Detection", desc: "Poetic metre identification for structured appreciation" },
                                { icon: "👁️", title: "Human Review", desc: "Every poem is reviewed by a human editor before publishing" },
                                { icon: "📚", title: "Living Archive", desc: "A growing, community-powered database of Marathi literature" },
                            ].map((t) => (
                                <div key={t.title} className="p-5 rounded-xl bg-[#F9F7F5] border border-gold/10 hover:bg-white hover:border-gold/25 transition-all">
                                    <span className="text-2xl mb-3 block">{t.icon}</span>
                                    <h3 className="font-serif font-bold text-foreground text-sm mb-1.5">{t.title}</h3>
                                    <p className="text-xs font-english text-foreground/55 leading-relaxed">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Vision ───────────────────────────────────────── */}
                <section className="py-20 md:py-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center" id="our-vision">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Our Vision</div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 leading-snug">
                        Marathi literature <span className="text-maroon">for everyone</span>
                    </h2>
                    <p className="text-foreground/70 font-english leading-relaxed mb-5 text-lg">
                        We envision a future where anyone — regardless of language background —
                        can discover and appreciate Marathi poetry.
                    </p>
                    <p className="text-foreground/65 font-english leading-relaxed mb-5">
                        Whether you grew up reading <strong>Kusumagraj</strong>, <strong>B. B. Borkar</strong>,{" "}
                        <strong>Bahinabai Chaudhari</strong>, <strong>Grace</strong>, or are reading
                        Marathi poetry for the very first time, Godwa aims to be your companion
                        in exploring the language, its emotions, and its literary traditions.
                    </p>
                </section>

                {/* ── FAQ ──────────────────────────────────────────── */}
                <section className="bg-white border-y border-gold/10 py-20 md:py-28" id="faq">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Frequently Asked</div>
                            <h2 className="text-3xl font-serif font-bold text-foreground">Questions about Godwa</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    q: "What is Godwa?",
                                    a: "Godwa is a digital home for Marathi poetry. Our mission is to preserve, organize, and make Marathi poetry accessible to everyone—whether you are a lifelong Marathi reader, someone learning the language, or simply curious about Maharashtra's rich literary heritage.",
                                },
                                {
                                    q: "Can I read Marathi poems in Roman script on Godwa?",
                                    a: "Yes. Every poem on Godwa can be read in Roman Marathi transliteration, making it accessible to readers who are not familiar with Devanagari script. You can switch between scripts instantly.",
                                },
                                {
                                    q: "What is Boli Bhasha and how does Godwa cover it?",
                                    a: "Boli Bhasha refers to regional and colloquial dialects of Marathi—words used in everyday speech across Maharashtra that may not appear in standard dictionaries. Godwa is building a comprehensive vocabulary of these words so readers can understand their meaning in context.",
                                },
                                {
                                    q: "What is Chhanda on Godwa?",
                                    a: "Chhanda refers to the poetic metre—the rhythmic structure of a poem. Godwa identifies and displays the Chhanda for each poem so readers can understand and appreciate its musical and structural form.",
                                },
                                {
                                    q: "How can I contribute to Godwa?",
                                    a: "If you have poems, manuscripts, or suggestions, you can contribute through Godwa's submit page. All contributions are reviewed before being published, ensuring quality and accuracy.",
                                },
                            ].map((faq, i) => (
                                <div key={i} className="rounded-2xl border border-gold/10 p-6 hover:border-maroon/15 transition-all bg-[#F9F7F5]">
                                    <h3 className="font-serif font-bold text-foreground text-lg mb-3">{faq.q}</h3>
                                    <p className="font-english text-sm text-foreground/65 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Join the Journey CTA ──────────────────────────── */}
                <section className="bg-maroon py-20 md:py-28" id="join-the-journey">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="font-marathi text-gold text-xl mb-4 tracking-wide">
                            मराठी साहित्य सर्वांसाठी आहे.
                        </p>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            Join the Journey
                        </h2>
                        <p className="text-white/65 font-english leading-relaxed max-w-xl mx-auto mb-5">
                            Marathi literature belongs to everyone.
                        </p>
                        <p className="text-white/55 font-english leading-relaxed max-w-xl mx-auto mb-10">
                            If you have poems, manuscripts, or suggestions, we invite you to
                            contribute and help preserve this rich literary heritage for future
                            generations. Together, we can build the world's most comprehensive
                            digital archive of Marathi poetry.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/explore"
                                className="px-8 py-3.5 rounded-full bg-white text-maroon font-english font-bold text-sm uppercase tracking-widest hover:bg-gold/10 transition-all shadow-xl"
                            >
                                Explore All Poems
                            </Link>
                            <Link
                                href="/submit"
                                className="px-8 py-3.5 rounded-full border border-white/30 text-white font-english font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Submit a Poem
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
