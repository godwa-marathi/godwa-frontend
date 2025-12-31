"use client";

import React from "react";
import Link from "next/link";
import { PoemOut, PoetOut } from "@/lib/types";
import { Calendar, User } from "lucide-react";

export const PoemCard = ({ poem }: { poem: PoemOut }) => {
    return (
        <Link href={`/poem/${poem.id}`} className="group relative block">
            <div className="h-full bg-white p-8 rounded-2xl border border-gold/10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                {/* Paper fold effect */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 transition-colors group-hover:bg-gold/10" />
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-white border-r-white z-10" />
                <div className="absolute top-0 right-0 w-[12px] h-[12px] bg-gold/20 -translate-x-[12px] translate-y-[12px] rotate-180" />

                <div className="flex flex-col h-full">
                    <div className="inline-block px-2 py-0.5 rounded bg-maroon/5 text-maroon text-[10px] font-bold uppercase tracking-widest mb-4 w-fit">
                        {poem.genre || "Collection"}
                    </div>

                    <h3 className="text-2xl font-marathi font-bold text-foreground mb-3 group-hover:text-maroon transition-colors">
                        {poem.title}
                    </h3>

                    <p className="text-foreground/60 font-marathi leading-relaxed mb-6 line-clamp-3">
                        {poem.body_marathi.split("\n")[0]}...
                    </p>

                    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gold/10">
                        <div className="w-8 h-8 rounded-full bg-maroon/5 flex items-center justify-center text-maroon">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-english font-medium text-foreground/80">
                            {poem.poet?.name || "Traditional"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const PoetCard = ({ poet }: { poet: PoetOut }) => {
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

                <h3 className="text-xl font-marathi font-bold text-foreground mb-1 group-hover:text-maroon transition-colors">
                    {poet.name}
                </h3>

                <div className="flex items-center gap-1.5 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Calendar className="w-3 h-3" />
                    {poet.life_span || "Timless Poet"}
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
