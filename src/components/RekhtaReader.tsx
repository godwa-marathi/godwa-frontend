"use client";

import React, { useState } from "react";
import { PoemOut } from "@/lib/types";
import { splitMarathiText } from "@/lib/utils";
import { WordTooltip } from "./WordTooltip";
import { Languages, BookOpen } from "lucide-react";

interface RekhtaReaderProps {
    poem: PoemOut;
}

export const RekhtaReader: React.FC<RekhtaReaderProps> = ({ poem }) => {
    const [showRoman, setShowRoman] = useState(false);

    const lines = poem.body_marathi.split("\n");
    const romanLines = poem.body_roman?.split("\n") || [];

    return (
        <div className="flex flex-col w-full">
            {/* Centered content container - max 600px like Rekhta, but responsive */}
            <div className="w-full max-w-[600px] mx-auto">

                {/* Minimal Reader Toolbar */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gold/10">
                    <div className="flex items-center gap-2 text-foreground/50">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-english font-medium text-xs uppercase tracking-wider">
                            Interactive Reader
                        </span>
                    </div>

                    {poem.body_roman && (
                        <button
                            onClick={() => setShowRoman(!showRoman)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 hover:bg-gold/5 hover:border-gold/50 transition-all text-maroon text-xs font-medium"
                        >
                            <Languages className="w-3.5 h-3.5" />
                            {showRoman ? "देवनागरी" : "Roman"}
                        </button>
                    )}
                </div>

                {/* Poem Body - Minimalist, centered, generous spacing like Rekhta */}
                <div className="space-y-8 animate-in fade-in duration-700">
                    {lines.map((line, lineIdx) => (
                        <div key={lineIdx} className="w-full">
                            {/* Devanagari Line */}
                            <div className={showRoman ? "hidden" : "block"}>
                                {/* Center-aligned, elegant font size (Rekhta style), generous line-height (2.0) */}
                                <div className="text-2xl md:text-3xl font-marathi leading-[2.2] text-foreground/90 text-center flex flex-wrap justify-center gap-x-1.5 gap-y-2">
                                    {splitMarathiText(line).map((word, wordIdx) => {
                                        const cleanWord = word.trim().replace(/[^\u0900-\u097F]/g, "");
                                        // Use optional chaining since poem.words might be undefined
                                        const wordData = poem.words?.find(w => w.devnagri === cleanWord);
                                        return (
                                            <WordTooltip
                                                key={wordIdx}
                                                word={word}
                                                data={wordData}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Roman Transliteration */}
                            {/* Roman Transliteration */}
                            {showRoman && romanLines[lineIdx] && (
                                <div className="text-xl md:text-2xl font-english italic text-maroon/70 leading-relaxed text-center flex flex-wrap justify-center gap-x-1.5 gap-y-2">
                                    {romanLines[lineIdx].split(" ").map((word, wordIdx) => {
                                        // Attempt to find word data by matching alternate/roman field in poem.words
                                        // Use Unicode property escapes to preserve diacritics (e.g. ḻ, ṃ)
                                        const cleanRoman = word.trim().replace(/[^\p{L}\p{M}\p{N}]/gu, "");
                                        const wordData = poem.words?.find(w =>
                                            w.word_alternate?.toLowerCase() === cleanRoman.toLowerCase() ||
                                            w.word?.toLowerCase() === cleanRoman.toLowerCase()
                                        );

                                        return (
                                            <WordTooltip
                                                key={wordIdx}
                                                word={word}
                                                data={wordData}
                                                isRoman={true}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Metre/Chhanda Info - Minimal card below poem */}
                {poem.chhanda_name && (
                    <div className="mt-16 p-5 rounded-lg bg-gold/3 border border-gold/10 flex flex-col gap-1.5">
                        <div className="text-[9px] uppercase tracking-[0.25em] text-gold/70 font-bold">Chhanda / Metre</div>
                        <div className="text-base font-marathi font-semibold text-maroon">
                            {poem.chhanda_name}
                        </div>
                        {poem.description && (
                            <p className="text-xs text-foreground/60 font-english leading-relaxed mt-1">
                                {poem.description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
