"use client";

import React from "react";
import { PoemOut } from "@/lib/types";
import { splitMarathiText } from "@/lib/utils";
import { WordTooltip } from "./WordTooltip";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface RekhtaReaderProps {
    poem: PoemOut;
}

export const RekhtaReader: React.FC<RekhtaReaderProps> = ({ poem }) => {
    const { language } = useLanguage();
    const hasRoman = !!poem.body_roman;
    const showRoman = language === "roman" && hasRoman;

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
                </div>

                {/* Poem Body - Minimalist, centered, tight lines, stanza breaks */}
                <div className="animate-in fade-in duration-700">
                    {lines.map((line, lineIdx) => {
                        const isEmptyLine = line.trim() === "";
                        const romanLine = romanLines[lineIdx];
                        const isRomanEmpty = !romanLine || romanLine.trim() === "";

                        // Empty line = stanza break spacer
                        if (isEmptyLine && (!showRoman || isRomanEmpty)) {
                            return <div key={lineIdx} className="h-6 md:h-8" />;
                        }

                        return (
                            <div key={lineIdx} className="w-full mb-1">
                                {/* Devanagari Line */}
                                <div className={showRoman ? "hidden" : "block"}>
                                    <div className="text-base min-[480px]:text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-marathi leading-[1.7] text-foreground/90 text-left flex flex-wrap justify-start gap-x-1 md:gap-x-1.5">
                                        {splitMarathiText(line).map((word, wordIdx) => (
                                            <WordTooltip
                                                key={wordIdx}
                                                word={word}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Roman Transliteration */}
                                {showRoman && romanLine && (
                                    <div className="text-sm min-[480px]:text-base sm:text-lg md:text-xl lg:text-[1.4rem] font-english text-foreground/85 leading-[1.6] text-left flex flex-wrap justify-start gap-x-1 md:gap-x-1.5">
                                        {romanLine.split(" ").map((word, wordIdx) => (
                                            <WordTooltip
                                                key={wordIdx}
                                                word={word}
                                                isRoman={true}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
