"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Search, Plus, Send, ChevronRight, ChevronLeft, Image as ImageIcon, Loader2, Languages } from "lucide-react";
import { api } from "@/lib/api";
import { PoetOut } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import Sanscript from "@indic-transliteration/sanscript";

export default function SubmitPoemPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [inputScript, setInputScript] = useState<"devanagari" | "roman">("devanagari");
    const [formData, setFormData] = useState({
        title: "",
        body_marathi: "",
        body_roman: "",
        genre: "",
        poet_name: "",
        poet_id: null as number | null,
    });
    const [poetSuggestions, setPoetSuggestions] = useState<PoetOut[]>([]);
    const [isSearchingPoets, setIsSearchingPoets] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { token, isLoading: authLoading } = useAuth();

    // Auth Guard
    React.useEffect(() => {
        if (!authLoading && !token) {
            router.push("/auth/login?redirect=/submit");
        }
    }, [token, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-maroon animate-spin" />
            </div>
        );
    }

    const handlePoetSearch = async (query: string) => {
        setFormData({ ...formData, poet_name: query, poet_id: null });
        if (query.length < 2) {
            setPoetSuggestions([]);
            return;
        }

        setIsSearchingPoets(true);
        try {
            const results = await api.get<PoetOut[]>(`/api/poets/search?q=${query}`);
            setPoetSuggestions(results);
        } catch (error) {
            console.error("Poet search failed", error);
        } finally {
            setIsSearchingPoets(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.post("/api/poems/submit", formData);
            router.push("/explore");
        } catch (error: any) {
            console.error("Submission failed", error);
            if (error.message?.includes("authenticated")) {
                alert("Your session has expired. Please sign in again.");
                router.push("/auth/login?redirect=/submit");
            } else {
                alert("Failed to submit poem. Please check all fields.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
                <div className="mb-12 text-center">
                    <div className="inline-block p-4 rounded-full bg-gold/5 text-gold mb-6 border border-gold/10">
                        <PenTool className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-2">{t.submit_title}</h1>
                    <p className="text-foreground/60 font-english italic">{t.submit_subtitle}</p>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 relative px-8">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gold/10 -translate-y-1/2 -z-10" />
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10 ${step >= s ? "bg-maroon text-white scale-110 shadow-lg shadow-maroon/20" : "bg-white text-gold border-2 border-gold/20"
                                }`}
                        >
                            {s}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl border border-gold/10 shadow-xl p-8 md:p-12 min-h-[400px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{t.submit_label_poet_name}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={t.submit_ph_poet_name}
                                            value={formData.poet_name}
                                            onChange={(e) => handlePoetSearch(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gold/10 rounded-xl focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none transition-all font-marathi"
                                        />
                                        {isSearchingPoets && (
                                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon animate-spin" />
                                        )}
                                        {poetSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gold/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                                {poetSuggestions.map(poet => (
                                                    <button
                                                        key={poet.id}
                                                        onClick={() => {
                                                            setFormData({ ...formData, poet_name: poet.name, poet_id: poet.id });
                                                            setPoetSuggestions([]);
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-gold/5 flex items-center justify-between border-b border-gold/5 last:border-0"
                                                    >
                                                        <span className="font-marathi font-bold">{poet.name}</span>
                                                        <Plus className="w-4 h-4 text-maroon" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{t.submit_label_poem_title}</label>
                                    <input
                                        type="text"
                                        placeholder={t.submit_ph_poem_title}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gold/10 rounded-xl focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none transition-all font-marathi"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{t.submit_label_genre}</label>
                                    <select
                                        value={formData.genre}
                                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gold/10 rounded-xl focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none transition-all font-english"
                                    >
                                        <option value="">{t.submit_ph_genre}</option>
                                        <option value="Romantic">{(t as any).cat_romantic}</option>
                                        <option value="Nature">{(t as any).cat_nature}</option>
                                        <option value="Spiritual">{(t as any).cat_spiritual}</option>
                                        <option value="Patriotic">{(t as any).cat_patriotic}</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{t.submit_label_body}</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setInputScript(inputScript === "devanagari" ? "roman" : "devanagari")}
                                            className="flex items-center gap-2 text-xs font-bold text-maroon uppercase tracking-widest hover:bg-maroon/5 px-3 py-1.5 rounded-lg border border-maroon/20 transition-all"
                                        >
                                            <Languages className="w-4 h-4" />
                                            {inputScript === "devanagari" ? "Switch to Roman (IAST)" : "देवनागरी"}
                                        </button>
                                        <button type="button" className="flex items-center gap-2 text-xs font-bold text-maroon uppercase tracking-widest hover:bg-maroon/5 px-3 py-1.5 rounded-lg border border-maroon/20 transition-all">
                                            <ImageIcon className="w-4 h-4" />
                                            {t.submit_btn_scan}
                                        </button>
                                    </div>
                                </div>

                                {/* Help text for IAST */}
                                {inputScript === "roman" && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                                        <p className="font-bold mb-1">📝 IAST Input Tips:</p>
                                        <p>Use macrons for long vowels: ā, ī, ū (e.g., "Pāūs" for पाऊस)</p>
                                        <p className="mt-1 text-blue-600">Or type without macrons and we'll do our best to convert!</p>
                                    </div>
                                )}

                                <textarea
                                    placeholder={inputScript === "devanagari" ? t.submit_ph_body : "Enter text in Roman script (IAST or plain)"}
                                    value={inputScript === "devanagari" ? formData.body_marathi : formData.body_roman}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (inputScript === "devanagari") {
                                            // Typing in Devanagari - auto-convert to IAST
                                            const romanConverted = Sanscript.t(value, "devanagari", "iast");
                                            setFormData({
                                                ...formData,
                                                body_marathi: value,
                                                body_roman: romanConverted
                                            });
                                        } else {
                                            // Typing in Roman - auto-convert to Devanagari
                                            const devanagariConverted = Sanscript.t(value, "iast", "devanagari");
                                            setFormData({
                                                ...formData,
                                                body_roman: value,
                                                body_marathi: devanagariConverted
                                            });
                                        }
                                    }}
                                    className={`w-full h-80 px-6 py-6 bg-white border border-gold/10 rounded-2xl focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none transition-all text-xl leading-relaxed resize-none ${inputScript === "devanagari" ? "font-marathi" : "font-english"
                                        }`}
                                />

                                {/* Preview of converted text */}
                                {(formData.body_marathi || formData.body_roman) && (
                                    <div className="bg-gold/5 border border-gold/10 rounded-xl p-4">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                                            {inputScript === "devanagari" ? "Roman Preview (IAST)" : "देवनागरी Preview"}
                                        </div>
                                        <p className={`text-base ${inputScript === "devanagari" ? "font-english" : "font-marathi"}`}>
                                            {inputScript === "devanagari" ? formData.body_roman : formData.body_marathi}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 flex-1 flex flex-col items-center justify-center text-center"
                            >
                                <div className="p-6 rounded-full bg-green-50 text-green-500 border border-green-100 mb-4">
                                    <ShieldCheck className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{t.submit_review_title}</h3>
                                    <p className="text-foreground/60 font-english max-w-xs mx-auto">
                                        {t.submit_review_desc}
                                    </p>
                                </div>
                                <div className="w-full p-6 rounded-2xl bg-gold/5 border border-gold/10 text-left">
                                    <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">{t.submit_review_preview}</div>
                                    <div className="font-marathi font-bold text-lg text-maroon">{formData.title}</div>
                                    <div className="text-sm font-marathi text-foreground/60">by {formData.poet_name}</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-gold/10">
                        <button
                            onClick={() => step > 1 && setStep(step - 1)}
                            disabled={step === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-english font-bold text-sm uppercase tracking-widest transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-gold/5 text-foreground/40"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {t.submit_btn_prev}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={step === 1 ? !formData.title || !formData.poet_name : !formData.body_marathi}
                                className="flex items-center gap-2 px-8 py-3 bg-maroon text-white rounded-xl font-english font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:grayscale hover:shadow-lg hover:shadow-maroon/20"
                            >
                                {t.submit_btn_next}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-maroon text-white rounded-xl font-english font-bold text-sm uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-maroon/20"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {t.submit_btn_submit}
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Reuse ShieldCheck from Login
function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
    );
}
