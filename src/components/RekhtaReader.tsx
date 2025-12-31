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
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto px-4 py-8">
            {/* Reader Toolbar */}
            <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                <div className="flex items-center gap-2 text-maroon">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-english font-medium tracking-wide uppercase text-sm">
                        Interactive Reader
                    </span>
                </div>

                {poem.body_roman && (
                    <button
                        onClick={() => setShowRoman(!showRoman)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-maroon/20 hover:bg-maroon/5 transition-colors text-maroon text-sm font-medium"
                    >
                        <Languages className="w-4 h-4" />
                        {showRoman ? "Бदेवनागरी" : "Roman Script"}
                    </button>
                )}
            </div>

            {/* Poem Body */}
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
                {lines.map((line, lineIdx) => (
                    <div key={lineIdx} className="flex flex-col gap-1">
                        {/* Devanagari Line */}
                        <div className={showRoman ? "hidden" : "block"}>
                            <div className="text-2xl md:text-3xl font-marathi leading-relaxed text-foreground flex flex-wrap gap-x-1">
                                {splitMarathiText(line).map((word, wordIdx) => {
                                    const cleanWord = word.trim().replace(/[^\u0900-\u097F]/g, "");
                                    const wordData = poem.words.find(w => w.devnagri === cleanWord);
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
                        {showRoman && romanLines[lineIdx] && (
                            <div className="text-xl md:text-2xl font-english italic text-maroon/80 leading-relaxed font-light">
                                {romanLines[lineIdx]}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Metre/Chhanda Info */}
            {poem.chhanda_name && (
                <div className="mt-12 p-6 rounded-xl bg-gold/5 border border-gold/20 flex flex-col gap-2">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Chhanda / Metre</div>
                    <div className="text-lg font-marathi font-semibold text-maroon">
                        {poem.chhanda_name}
                    </div>
                    {poem.description && (
                        <p className="text-sm text-foreground/70 font-english leading-relaxed">
                            {poem.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
