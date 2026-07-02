"use client";

import React from "react";
import Link from "next/link";
import { PoemOut, PoetOut } from "@/lib/types";
import { Calendar, User } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export const PoemCard = ({ poem }: { poem: PoemOut }) => {
    const { language } = useLanguage();
    const displayTitle = language === 'roman' ? (poem.title_roman || poem.title) : poem.title;
    const displayBody = language === 'roman' ? (poem.body_roman || poem.body_marathi) : poem.body_marathi;
    const displayPoetName = language === 'roman' ? (poem.poet?.name_roman || poem.poet?.name) : poem.poet?.name;

    return (
        <Link href={`/poem/${poem.url_slug || poem.id}`} className="group relative block">
            <div className="h-full bg-white p-8 rounded-2xl border border-gold/10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                {/* Paper fold effect */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 transition-colors group-hover:bg-gold/10" />
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-white border-r-white z-10" />
                <div className="absolute top-0 right-0 w-[12px] h-[12px] bg-gold/20 -translate-x-[12px] translate-y-[12px] rotate-180" />

                <div className="flex flex-col h-full">
                    <div className="inline-block px-2 py-0.5 rounded bg-maroon/5 text-maroon text-[10px] font-bold uppercase tracking-widest mb-4 w-fit">
                        {poem.genre || "Collection"}
                    </div>

                    <h3 className={`text-2xl font-bold text-foreground mb-3 group-hover:text-maroon transition-colors ${language === 'roman' ? 'font-english' : 'font-marathi'}`}>
                        {language === 'roman' ? (
                            <>
                                {poem.title_roman || poem.title}
                                {poem.title_roman && poem.title && (
                                    <span className="text-sm font-normal text-foreground/40 font-marathi ml-2 font-sans">({poem.title})</span>
                                )}
                            </>
                        ) : (
                            <>
                                {poem.title}
                                {poem.title_roman && (
                                    <span className="text-xs font-normal text-foreground/45 font-english ml-2 font-serif">({poem.title_roman})</span>
                                )}
                            </>
                        )}
                    </h3>

                    <p className={`text-foreground/60 leading-relaxed mb-6 line-clamp-3 ${language === 'roman' ? 'font-english text-sm' : 'font-marathi'}`}>
                        {displayBody.split("\n")[0]}...
                    </p>

                    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gold/10">
                        <div className="w-8 h-8 rounded-full bg-maroon/5 flex items-center justify-center text-maroon overflow-hidden">
                            {poem.poet?.image_url ? (
                                <img src={poem.poet.image_url} alt={displayPoetName || ''} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </div>
                        <span className="text-sm font-english font-medium text-foreground/80">
                            {language === 'roman' ? (
                                <>
                                    {poem.poet?.name_roman || poem.poet?.name || "Traditional"}
                                    {poem.poet?.name_roman && poem.poet?.name && (
                                        <span className="text-xs font-normal text-foreground/40 font-marathi ml-1.5 font-sans">({poem.poet.name})</span>
                                    )}
                                </>
                            ) : (
                                <>
                                    {poem.poet?.name || "Traditional"}
                                    {poem.poet?.name_roman && (
                                        <span className="text-xs font-normal text-foreground/45 font-english ml-1.5 font-serif">({poem.poet.name_roman})</span>
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const PoetCard = ({ poet, viewMode = 'grid' }: { poet: PoetOut; viewMode?: 'grid' | 'list' }) => {
    const { language } = useLanguage();
    const displayPoetName = language === 'roman' ? (poet.name_roman || poet.name) : poet.name;

    if (viewMode === 'list') {
        return (
            <Link href={`/poets/${poet.id}`} className="group block">
                <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gold/10 transition-all duration-200 hover:bg-maroon/[0.03] hover:border-maroon/20">
                    {/* Small Avatar */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-full border border-gold/20 overflow-hidden bg-gold/10 flex items-center justify-center group-hover:border-maroon/40 transition-colors">
                        {poet.image_url ? (
                            <img src={poet.image_url} alt={poet.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-gold/40" />
                        )}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                        {/* Primary name */}
                        <div className="flex items-baseline gap-2 min-w-0">
                            <span className={`text-sm font-bold text-foreground group-hover:text-maroon transition-colors truncate ${language === 'roman' ? 'font-english' : 'font-marathi'}`}>
                                {language === 'roman' ? (poet.name_roman || poet.name) : poet.name}
                            </span>
                            {/* Secondary name */}
                            {language === 'roman' && poet.name_roman && poet.name ? (
                                <span className="font-marathi text-xs text-foreground/40 truncate hidden sm:inline">{poet.name}</span>
                            ) : language === 'devanagari' && poet.name_roman ? (
                                <span className="font-english text-xs text-foreground/40 font-serif truncate hidden sm:inline">{poet.name_roman}</span>
                            ) : null}
                        </div>

                        {/* Meta: lifespan + poem count */}
                        <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                            {(poet.life_span) && (
                                <span className="flex items-center gap-1 text-[10px] text-foreground/40 font-english">
                                    <Calendar className="w-2.5 h-2.5" />
                                    {poet.life_span}
                                </span>
                            )}
                            {poet.poem_count != null && poet.poem_count > 0 && (
                                <span className="text-[10px] font-bold text-maroon bg-maroon/8 px-2 py-0.5 rounded-full">
                                    {poet.poem_count}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/poets/${poet.id}`} className="group block">
            <div className="flex flex-col items-center p-6 text-center transition-transform hover:-translate-y-2">
                <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full border-2 border-gold/30 p-1 group-hover:border-maroon transition-colors">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gold/10 flex items-center justify-center">
                            {poet.image_url ? (
                                <img src={poet.image_url} alt={poet.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gold/40" />
                            )}
                        </div>
                    </div>
                    {poet.poem_count && (
                        <div className="absolute -bottom-2 -right-2 bg-maroon text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                            {poet.poem_count} Poems
                        </div>
                    )}
                </div>

                <h3 className={`text-xl font-bold text-foreground mb-1 group-hover:text-maroon transition-colors ${language === 'roman' ? 'font-english' : 'font-marathi'}`}>
                    {language === 'roman' ? (
                        <>{poet.name_roman || poet.name}</>
                    ) : (
                        <>{poet.name}</>
                    )}
                </h3>

                {language === 'roman' && poet.name_roman && poet.name ? (
                    <div className="font-marathi text-sm text-foreground/60 mb-2">
                        {poet.name}
                    </div>
                ) : language === 'devanagari' && poet.name_roman ? (
                    <div className="font-english text-xs text-foreground/60 font-serif mb-2">
                        {poet.name_roman}
                    </div>
                ) : null}

                <div className="flex items-center gap-1.5 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Calendar className="w-3 h-3" />
                    {poet.life_span || "Timeless Poet"}
                </div>

                {poet.bio && (
                    <p className="text-sm text-foreground/60 font-english line-clamp-2 italic">
                        {poet.bio}
                    </p>
                )}
            </div>
        </Link>
    );
};
