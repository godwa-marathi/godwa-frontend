"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Book, Users, PenTool } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export const Hero = () => {
    const { t } = useLanguage();
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gold/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-maroon/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold tracking-widest uppercase mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                        </span>
                        {t.home_hero_tag}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-[1.1]">
                        {t.home_hero_title_prefix} <br />
                        <span className="text-maroon italic">{t.home_hero_title_suffix}</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 font-english leading-relaxed mb-10">
                        {t.home_hero_desc}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <button className="w-full sm:w-auto px-8 py-4 bg-maroon text-white rounded-full font-english font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-maroon/20 group">
                            {t.home_hero_btn_start}
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-maroon border-2 border-maroon rounded-full font-english font-semibold transition-all hover:bg-maroon/5 active:scale-95">
                            {t.home_hero_btn_contribute}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto pt-10 border-t border-gold/10">
                        <div className="flex flex-col items-center gap-1">
                            <div className="p-3 rounded-2xl bg-gold/10 text-gold mb-2">
                                <Book className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-foreground">1,200+</span>
                            <span className="text-[10px] font-english text-gold font-bold uppercase tracking-widest">{t.home_stat_poems}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="p-3 rounded-2xl bg-gold/10 text-gold mb-2">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-foreground">450+</span>
                            <span className="text-[10px] font-english text-gold font-bold uppercase tracking-widest">{t.home_stat_poets}</span>
                        </div>
                        <div className="flex flex-col md:flex items-center gap-1 col-span-2 md:col-span-1">
                            <div className="p-3 rounded-2xl bg-gold/10 text-gold mb-2">
                                <PenTool className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-foreground">15k+</span>
                            <span className="text-[10px] font-english text-gold font-bold uppercase tracking-widest">{t.home_stat_words}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
