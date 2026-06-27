"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { PoemOut } from "@/lib/types";
import { splitMarathiText } from "@/lib/utils";
import { BookOpen, AlignCenter, AlignLeft, AlignJustify, FileText, Languages, Info } from "lucide-react";
import React from "react";
import { WordTooltip } from "./WordTooltip";

interface RekhtaReaderProps {
    poem: PoemOut;
}

export const RekhtaReader: React.FC<RekhtaReaderProps> = ({ poem }) => {
    const { language } = useLanguage();
    const [viewMode, setViewMode] = React.useState<"poem" | "with_meaning" | "meaning">("poem");
    const [alignment, setAlignment] = React.useState<"center" | "left" | "justify">("center");

    const hasRoman = !!poem.body_roman;
    const showRoman = language === "roman" && hasRoman;

    const marathiBody = poem.body_marathi || "";
    const romanBody = poem.body_roman || "";
    const hasMeaning = !!poem.body_meaning;
    const meaningBody = poem.body_meaning || "";

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
    const meaningLines = meaningBody ? normalizeNewlines(meaningBody).split("\n") : [];

    return (
        <div className="flex flex-col w-full">
            {/* Centered content container - max 600px like Rekhta, but responsive */}
            <div className="w-full max-w-[600px] mx-auto">

                {/* Minimal Reader Toolbar */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gold/10">
                    <div className="hidden sm:flex items-center gap-2 text-foreground/50">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-english font-medium text-xs uppercase tracking-wider">
                            Interactive Reader
                        </span>
                    </div>

                    {/* Toggles Container */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        {/* Alignment Toggle */}
                        <div className="flex items-center bg-foreground/5 p-0.5 rounded-md border border-gold/5">
                            <button
                                onClick={() => setAlignment("left")}
                                className={`p-1.5 rounded-md transition-all ${
                                    alignment === "left"
                                        ? "bg-gold text-white shadow-sm"
                                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                }`}
                                title="Left Align"
                            >
                                <AlignLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setAlignment("center")}
                                className={`p-1.5 rounded-md transition-all ${
                                    alignment === "center"
                                        ? "bg-gold text-white shadow-sm"
                                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                }`}
                                title="Center Align"
                            >
                                <AlignCenter className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setAlignment("justify")}
                                className={`p-1.5 rounded-md transition-all ${
                                    alignment === "justify"
                                        ? "bg-gold text-white shadow-sm"
                                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                }`}
                                title="Justify Align"
                            >
                                <AlignJustify className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Meaning Mode Toggle (Only if hasMeaning) */}
                        {hasMeaning && (
                            <div className="flex items-center bg-foreground/5 p-0.5 rounded-md border border-gold/5 text-xs font-english">
                                <button
                                    onClick={() => setViewMode("poem")}
                                    className={`px-2.5 py-1.5 rounded-md transition-all flex items-center ${
                                        viewMode === "poem"
                                            ? "bg-gold text-white shadow-sm"
                                            : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                    }`}
                                    title="Poem Only"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline text-[11px] font-medium ml-1.5">Poem</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("with_meaning")}
                                    className={`px-2.5 py-1.5 rounded-md transition-all flex items-center ${
                                        viewMode === "with_meaning"
                                            ? "bg-gold text-white shadow-sm"
                                            : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                    }`}
                                    title="Poem + Meaning"
                                >
                                    <Languages className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline text-[11px] font-medium ml-1.5">Bilingual</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("meaning")}
                                    className={`px-2.5 py-1.5 rounded-md transition-all flex items-center ${
                                        viewMode === "meaning"
                                            ? "bg-gold text-white shadow-sm"
                                            : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                    }`}
                                    title="Meaning Only"
                                >
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline text-[11px] font-medium ml-1.5">Meaning</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Poem Body - Minimalist, centered, left-aligned or justified, tight line heights, stanza breaks */}
                <div className={`animate-in fade-in duration-700 w-full py-2 ${alignment === "center" ? "text-center" : (alignment === "justify" ? "text-justify" : "text-left")}`}>
                    {lines.map((line, lineIdx) => {
                        const isEmptyLine = line.trim() === "";
                        const romanLine = romanLines[lineIdx];
                        const isRomanEmpty = !romanLine || romanLine.trim() === "";
                        const meaningLine = meaningLines[lineIdx];
                        const isMeaningEmpty = !meaningLine || meaningLine.trim() === "";

                        // Empty line = stanza break spacer
                        if (isEmptyLine && (!showRoman || isRomanEmpty) && (viewMode !== "meaning" || isMeaningEmpty)) {
                            return <div key={lineIdx} className="h-4 md:h-5" />;
                        }

                        // Special case: meaning only empty line
                        if (viewMode === "meaning" && isMeaningEmpty) {
                            return <div key={lineIdx} className="h-4 md:h-5" />;
                        }

                        const alignmentClass = alignment === "center" ? "justify-center text-center" : "justify-start text-left";

                        return (
                            <div 
                                key={lineIdx} 
                                className={`w-full mb-3 flex flex-col ${
                                    alignment === "center" 
                                        ? "items-center" 
                                        : (alignment === "justify" ? "items-stretch" : "items-start px-2 sm:px-4")
                                }`}
                            >
                                {/* Poem Line (only if NOT in meaning_only mode) */}
                                {viewMode !== "meaning" && (
                                    <>
                                        {/* Devanagari Line */}
                                        <div className={`${showRoman ? "hidden" : "block"} w-full`}>
                                            <div className={`text-[13px] min-[360px]:text-[14px] min-[400px]:text-base sm:text-lg md:text-xl lg:text-[1.5rem] font-marathi leading-[1.5] text-foreground/90 py-0.5 ${
                                                alignment === "justify" 
                                                    ? "text-justify [text-align-last:justify] w-full max-w-[90%] mx-auto block" 
                                                    : `flex flex-wrap ${alignmentClass} gap-x-1 md:gap-x-1.5`
                                            }`}>
                                                {splitMarathiText(line).map((word, wordIdx) => (
                                                    <React.Fragment key={wordIdx}>
                                                        <WordTooltip word={word} />
                                                        {wordIdx < splitMarathiText(line).length - 1 && " "}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Roman Transliteration */}
                                        {showRoman && romanLine && (
                                            <div className={`text-[11px] min-[360px]:text-[12px] min-[400px]:text-sm sm:text-base md:text-lg lg:text-[1.25rem] font-serif italic text-foreground/80 leading-[1.4] py-0.5 tracking-wide ${
                                                alignment === "justify" 
                                                    ? "text-justify [text-align-last:justify] w-full max-w-[90%] mx-auto block" 
                                                    : `flex flex-wrap ${alignmentClass} gap-x-1 md:gap-x-1.5`
                                            }`}>
                                                {romanLine.split(" ").map((word, wordIdx) => (
                                                    <React.Fragment key={wordIdx}>
                                                        <WordTooltip
                                                            word={word}
                                                            isRoman={true}
                                                        />
                                                        {wordIdx < romanLine.split(" ").length - 1 && " "}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Meaning Line (only if in with_meaning or meaning_only mode) */}
                                {viewMode !== "poem" && !isMeaningEmpty && (
                                    <div 
                                        className={`w-full font-english text-foreground/60 leading-relaxed ${
                                            viewMode === "meaning" 
                                                ? "text-sm sm:text-base md:text-lg py-1" 
                                                : "text-[11px] min-[360px]:text-[12px] min-[400px]:text-xs sm:text-sm md:text-base italic mt-1 mb-1 py-0.5 border-l-2 border-gold/20 pl-3 ml-1 sm:ml-2"
                                        } ${
                                            alignment === "center" 
                                                ? "text-center border-l-0 pl-0 ml-0" 
                                                : (alignment === "justify" ? "text-justify w-full max-w-[90%] mx-auto border-l-0 pl-0 ml-0" : "text-left")
                                        }`}
                                    >
                                        {meaningLine}
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