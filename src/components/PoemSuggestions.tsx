"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { PoemSuggestion } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";

interface PoemSuggestionsProps {
    /** The poem currently being read; never suggested. */
    excludeId: number;
    limit?: number;
}

/** "Explore more": a few random approved poems. Hidden when there is nothing to show. */
export function PoemSuggestions({ excludeId, limit = 3 }: PoemSuggestionsProps) {
    const { t, language } = useLanguage();

    const { data: poems } = useQuery({
        queryKey: ["poems", "random", excludeId, limit],
        queryFn: () => api.get<PoemSuggestion[]>(`/api/poems/random?exclude_id=${excludeId}&limit=${limit}`),
        // Keep the picks stable while the reader stays on the page.
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    if (!poems || poems.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/30 pl-1">{t.poem_explore_more}</h3>
            <div className="space-y-2">
                {poems.map((poem) => {
                    const roman = language === "roman";
                    const title = roman ? poem.title_roman || poem.title : poem.title;
                    const poetName = roman
                        ? poem.poet?.name_roman || poem.poet?.name
                        : poem.poet?.name;
                    return (
                        <Link
                            key={poem.id}
                            href={`/poem/${poem.url_slug || poem.id}`}
                            className="flex items-center justify-between p-3 bg-white hover:bg-white/80 border border-transparent hover:border-maroon/10 rounded-xl transition-all group cursor-pointer"
                        >
                            <div>
                                <div className={`font-bold text-sm group-hover:text-maroon transition-colors ${roman ? "font-english" : "font-marathi"}`}>
                                    {title}
                                </div>
                                {poetName && <div className="text-[10px] text-foreground/40">{poetName}</div>}
                            </div>
                            <ArrowLeft className="w-3 h-3 rotate-180 text-foreground/20 group-hover:text-maroon transition-colors" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
