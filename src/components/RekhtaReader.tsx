"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { PoemOut } from "@/lib/types";
import { splitMarathiText } from "@/lib/utils";
import { BookOpen, AlignCenter, AlignLeft, AlignJustify, FileText, Languages, Info, Settings } from "lucide-react";
import React from "react";
import { WordTooltip } from "./WordTooltip";

interface RekhtaReaderProps {
    poem: PoemOut;
}

// 5 Typography Options Config as requested
const STYLE_VARIANTS = {
    lora: {
        id: "lora",
        name: "Option 1: Lora + Inter",
        romanOnly: "font-lora italic font-medium text-[17px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[1.85] tracking-[0.015em] text-foreground/90 max-w-[40ch] mx-auto",
        romanBilingual: "font-lora italic font-medium text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[1.4] tracking-[0.015em] text-foreground/90",
        translationBilingual: "font-sans text-[11px] sm:text-[12px] md:text-[13px] text-foreground/50 leading-relaxed font-normal tracking-wide mt-1.5 mb-2.5 pl-3 ml-2 border-l border-gold/20"
    },
    cormorant: {
        id: "cormorant",
        name: "Option 2: Cormorant Garamond + Outfit",
        romanOnly: "font-cormorant italic font-semibold text-[19px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-[1.95] tracking-[0.010em] text-foreground/90 max-w-[38ch] mx-auto",
        romanBilingual: "font-cormorant italic font-semibold text-[17px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[1.4] tracking-[0.010em] text-foreground/90",
        translationBilingual: "font-outfit text-[11px] sm:text-[12px] md:text-[13px] text-foreground/50 leading-relaxed font-light tracking-wider mt-1.5 mb-2.5 pl-3 ml-2 border-l border-gold/20"
    },
    playfair: {
        id: "playfair",
        name: "Option 3: Playfair Display + Mulish",
        romanOnly: "font-serif italic font-medium text-[18px] sm:text-[19px] md:text-[21px] lg:text-[23px] leading-[1.90] tracking-[0.020em] text-foreground/90 max-w-[42ch] mx-auto",
        romanBilingual: "font-serif italic font-medium text-[16px] sm:text-[17px] md:text-[19px] lg:text-[21px] leading-[1.4] tracking-[0.015em] text-foreground/90",
        translationBilingual: "font-mulish text-[11px] sm:text-[12px] md:text-[13px] text-foreground/50 leading-relaxed font-light tracking-normal mt-1.5 mb-2.5 pl-3 ml-2 border-l border-gold/20"
    },
    garamond: {
        id: "garamond",
        name: "Option 4: EB Garamond + Plus Jakarta Sans",
        romanOnly: "font-eb-garamond italic font-medium text-[18px] sm:text-[19px] md:text-[21px] lg:text-[23px] leading-[1.80] tracking-[0.025em] text-foreground/90 max-w-[40ch] mx-auto",
        romanBilingual: "font-eb-garamond italic font-medium text-[16px] sm:text-[17px] md:text-[19px] lg:text-[21px] leading-[1.4] tracking-[0.020em] text-foreground/90",
        translationBilingual: "font-jakarta text-[11px] sm:text-[12px] md:text-[13px] text-foreground/50 leading-relaxed font-normal tracking-wide mt-1.5 mb-2.5 pl-3 ml-2 border-l border-gold/20"
    },
    alegreya: {
        id: "alegreya",
        name: "Option 5: Alegreya + Alegreya Sans",
        romanOnly: "font-alegreya italic font-medium text-[17px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[1.80] tracking-[0.015em] text-foreground/90 max-w-[40ch] mx-auto",
        romanBilingual: "font-alegreya italic font-medium text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[1.4] tracking-[0.015em] text-foreground/90",
        translationBilingual: "font-alegreya-sans text-[11px] sm:text-[12px] md:text-[13px] text-foreground/50 leading-relaxed font-normal tracking-wide mt-1.5 mb-2.5 pl-3 ml-2 border-l border-gold/20"
    }
} as const;

type VariantKey = keyof typeof STYLE_VARIANTS;

export const RekhtaReader: React.FC<RekhtaReaderProps> = ({ poem }) => {
    const { language } = useLanguage();
    const [viewMode, setViewMode] = React.useState<"poem" | "with_meaning" | "meaning">("poem");
    const [alignment, setAlignment] = React.useState<"center" | "left" | "justify">("center");
    
    // Dynamic Typography Variant State - Default to 'lora' as requested
    const [romanStyleVariant, setRomanStyleVariant] = React.useState<VariantKey>("lora");
    const [showPreview, setShowPreview] = React.useState(false);

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

    const alignmentClass = alignment === "center" ? "justify-center text-center" : "justify-start text-left";

    // Helper to get Roman Class based on active state and variant
    const getRomanClass = (variant: VariantKey, isOnlyRoman: boolean) => {
        const config = STYLE_VARIANTS[variant];
        const base = isOnlyRoman ? config.romanOnly : config.romanBilingual;
        const alignClass = alignment === "justify" 
            ? "text-justify [text-align-last:justify] w-full max-w-[90%] mx-auto block" 
            : `flex flex-wrap ${alignmentClass} gap-x-1 md:gap-x-1.5`;
        return `${base} ${alignClass}`;
    };

    // Helper to get Translation Class based on active state and variant
    const getTranslationClass = (variant: VariantKey, isBilingual: boolean) => {
        const base = STYLE_VARIANTS[variant].translationBilingual;
        if (viewMode === "meaning") {
            const sizeClass = "text-[14px] sm:text-[15px] md:text-[17px]";
            const fontClass = variant === "cormorant" ? "font-outfit font-light" 
                            : variant === "playfair" ? "font-mulish font-light"
                            : variant === "garamond" ? "font-jakarta font-normal"
                            : variant === "alegreya" ? "font-alegreya-sans font-normal"
                            : "font-sans font-normal";
            const alignClass = alignment === "center" ? "text-center" 
                             : alignment === "justify" ? "text-justify max-w-[90%] mx-auto" 
                             : "text-left";
            return `${fontClass} ${sizeClass} ${alignClass} text-foreground/80 leading-relaxed py-1`;
        }
        
        let layoutModifiers = "";
        if (alignment === "center") {
            layoutModifiers = "border-l-0 pl-0 ml-0 text-center";
        } else if (alignment === "justify") {
            layoutModifiers = "border-l-0 pl-0 ml-0 text-justify max-w-[90%] mx-auto";
        } else {
            layoutModifiers = "border-l border-gold/20 pl-3 ml-1 sm:ml-2 text-left";
        }
        
        const cleanedBase = base.replace("border-l border-gold/20 pl-3 ml-2", "");
        return `${cleanedBase} ${layoutModifiers}`;
    };

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

                        {/* Typography Live Sandbox Trigger Toggle (Bilingual/Roman only modes) */}
                        {showRoman && (
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className={`p-1.5 rounded-md transition-all ${
                                    showPreview
                                        ? "bg-maroon text-white shadow-sm"
                                        : "text-foreground/60 hover:text-maroon hover:bg-foreground/5"
                                }`}
                                title="Typography Preview Control Panel"
                            >
                                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                            </button>
                        )}

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

                {/* Main Poem Body Display area */}
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

                        const romanClass = showRoman ? getRomanClass(romanStyleVariant, viewMode === "poem") : "";
                        const translationClass = getTranslationClass(romanStyleVariant, viewMode === "with_meaning");

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

                                        {/* Roman Transliteration with Dynamic Variant Classes */}
                                        {showRoman && romanLine && (
                                            <div className={`${romanClass} py-0.5 py-0.5`}>
                                                {alignment === "justify" ? (
                                                    romanLine.split(" ").map((word, wordIdx) => (
                                                        <React.Fragment key={wordIdx}>
                                                            <WordTooltip
                                                                word={word}
                                                                isRoman={true}
                                                            />
                                                            {wordIdx < romanLine.split(" ").length - 1 && " "}
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    romanLine.split(" ").map((word, wordIdx) => (
                                                        <WordTooltip
                                                            key={wordIdx}
                                                            word={word}
                                                            isRoman={true}
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Meaning Line (only if in with_meaning or meaning_only mode) */}
                                {viewMode !== "poem" && !isMeaningEmpty && (
                                    <div className={translationClass}>
                                        {meaningLine}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Dev-only Typography Options Preview Stack (Renders first stanza in 5 options for comparison) */}
                {showPreview && showRoman && lines.length > 0 && (
                    <div className="mt-8 border border-gold/25 rounded-2xl bg-white p-5 space-y-6 shadow-sm animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                            <div>
                                <h4 className="font-english font-bold text-xs uppercase tracking-wider text-gold">
                                    Typography Preview Board
                                </h4>
                                <p className="text-[10px] font-english text-foreground/40 mt-0.5">Compare layout variations side-by-side</p>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold">DEV ONLY</span>
                        </div>

                        <div className="space-y-6 text-left">
                            {(["lora", "cormorant", "playfair", "garamond", "alegreya"] as const).map((variant) => {
                                const cfg = STYLE_VARIANTS[variant];
                                
                                // Preview first 4 lines of the poem
                                const previewLimit = Math.min(lines.length, 4);
                                const previewLines = lines.slice(0, previewLimit);
                                const previewRoman = romanLines.slice(0, previewLimit);
                                const previewMeaning = meaningLines.slice(0, previewLimit);

                                // Use variant-specific styles
                                const romanStyle = viewMode === "poem" ? cfg.romanOnly : cfg.romanBilingual;
                                const isSelected = romanStyleVariant === variant;

                                return (
                                    <div key={variant} className={`p-4 rounded-xl border transition-all ${
                                        isSelected 
                                            ? "border-gold/50 bg-gold/2 shadow-inner" 
                                            : "border-foreground/5 bg-foreground/3 hover:bg-foreground/4"
                                    }`}>
                                        <div className="flex items-center justify-between border-b border-foreground/5 pb-2 mb-3">
                                            <span className="text-[10px] font-english font-bold text-foreground/60 tracking-wider">
                                                {cfg.name}
                                            </span>
                                            <button
                                                onClick={() => setRomanStyleVariant(variant)}
                                                className={`px-2.5 py-1 rounded-md text-[9px] uppercase tracking-wider font-bold transition-all ${
                                                    isSelected
                                                        ? "bg-gold text-white"
                                                        : "bg-foreground/10 text-foreground/60 hover:bg-gold/20"
                                                }`}
                                            >
                                                {isSelected ? "Active" : "Apply"}
                                            </button>
                                        </div>

                                        <div className={`py-1 ${alignment === "center" ? "text-center" : (alignment === "justify" ? "text-justify" : "text-left")}`}>
                                            {previewLines.map((l, idx) => {
                                                const rLine = previewRoman[idx];
                                                const mLine = previewMeaning[idx];
                                                const isMEmpty = !mLine || mLine.trim() === "";

                                                if (l.trim() === "" && (!showRoman || !rLine || rLine.trim() === "")) {
                                                    return <div key={idx} className="h-3" />;
                                                }

                                                // Base translation settings
                                                let layoutModifiers = "";
                                                if (alignment === "center") {
                                                    layoutModifiers = "border-l-0 pl-0 ml-0 text-center";
                                                } else if (alignment === "justify") {
                                                    layoutModifiers = "border-l-0 pl-0 ml-0 text-justify max-w-[90%] mx-auto";
                                                } else {
                                                    layoutModifiers = "border-l border-gold/20 pl-3 ml-2 text-left";
                                                }
                                                const cleanedTransBase = cfg.translationBilingual.replace("border-l border-gold/20 pl-3 ml-2", "");
                                                const finalTransClass = `${cleanedTransBase} ${layoutModifiers}`;

                                                return (
                                                    <div 
                                                        key={idx} 
                                                        className={`w-full mb-3 flex flex-col ${
                                                            alignment === "center" 
                                                                ? "items-center" 
                                                                : (alignment === "justify" ? "items-stretch" : "items-start")
                                                        }`}
                                                    >
                                                        {viewMode !== "meaning" && rLine && (
                                                            <div className={`${romanStyle} leading-[1.5] py-0.5 ${
                                                                alignment === "justify" 
                                                                    ? "text-justify [text-align-last:justify] w-full max-w-[90%] mx-auto block" 
                                                                    : `flex flex-wrap ${alignmentClass} gap-x-1`
                                                            }`}>
                                                                {rLine.split(" ").map((w, wIdx) => (
                                                                    <span key={wIdx} className="inline-block">{w}&nbsp;</span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {viewMode !== "poem" && !isMEmpty && (
                                                            <div className={finalTransClass}>
                                                                {mLine}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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