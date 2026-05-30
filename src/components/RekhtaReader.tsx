"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { PoemOut } from "@/lib/types";
import { splitMarathiText } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import React from "react";
import { WordTooltip } from "./WordTooltip";

interface RekhtaReaderProps {
    poem: PoemOut;
}

export const RekhtaReader: React.FC<RekhtaReaderProps> = ({ poem }) => {
    const { language } = useLanguage();
    const hasRoman = !!poem.body_roman;
    const showRoman = language === "roman" && hasRoman;

    const marathiBody = poem.body_marathi || "";
    const romanBody = poem.body_roman || "";

    // Normalize all kinds of newlines (double-escaped \\n, \r\n, \r) to \n
    const normalizeNewlines = (text: string) => {
        return text
            .replace(/\\r\\n/g, "\n")
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, "\n")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");
    };

    const lines = marathiBody ? normalizeNewlines(marathiBody).split("\n") : [];
    const romanLines = romanBody ? normalizeNewlines(romanBody).split("\n") : [];

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
                <div className="animate-in fade-in duration-700 w-full py-4 text-center">
                    {lines.map((line, lineIdx) => {
                        const isEmptyLine = line.trim() === "";
                        const romanLine = romanLines[lineIdx];
                        const isRomanEmpty = !romanLine || romanLine.trim() === "";

                        // Empty line = stanza break spacer
                        if (isEmptyLine && (!showRoman || isRomanEmpty)) {
                            return <div key={lineIdx} className="h-6 md:h-8" />;
                        }

                        return (
                            <div key={lineIdx} className="w-full mb-2">
                                {/* Devanagari Line */}
                                <div className={showRoman ? "hidden" : "block"}>
                                    <div className="text-[13px] min-[360px]:text-[14px] min-[400px]:text-base sm:text-lg md:text-xl lg:text-[1.5rem] font-marathi leading-[1.7] text-foreground/90 flex flex-wrap justify-center gap-x-1 md:gap-x-1.5 py-1">
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
                                    <div className="text-[11px] min-[360px]:text-[12px] min-[400px]:text-sm sm:text-base md:text-lg lg:text-[1.25rem] font-english text-foreground/85 leading-[1.6] flex flex-wrap justify-center gap-x-1 md:gap-x-1.5 py-1">
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