"use client";

import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { WordOut } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";

interface WordTooltipProps {
    word: string;
    data?: WordOut;
    isRoman?: boolean;
}

export const WordTooltip: React.FC<WordTooltipProps> = ({ word, data, isRoman = false }) => {
    const [open, setOpen] = React.useState(false);
    const [showNotFound, setShowNotFound] = React.useState(false);

    // Extract clean word based on script type
    const cleanWord = isRoman
        ? word.trim().replace(/[^\p{L}\p{M}\p{N}]/gu, "")
        : word.trim().replace(/[^\u0900-\u097F]/g, "");

    // 3-Second Timeout Logic
    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (open && !data && !showNotFound) {
            timer = setTimeout(() => {
                setShowNotFound(true);
            }, 3000);
        } else if (!open) {
            setShowNotFound(false);
        }
        return () => clearTimeout(timer);
    }, [open, data, showNotFound]);

    // Lazy load word meaning when tooltip opens (only if not pre-loaded)
    const { data: fetchedMeanings, isLoading } = useQuery({
        queryKey: ["word", "meaning", cleanWord],
        queryFn: async () => {
            if (!cleanWord) return [];
            // If Roman, we might want to hint the API, but typically it auto-detects or searches 'word_alternate'
            const result = await api.get<WordOut[]>(`/api/words/meaning?word=${encodeURIComponent(cleanWord)}`);
            return result;
        },
        enabled: open && !data && cleanWord.length > 0 && !showNotFound, // Only fetch when tooltip opens and no pre-loaded data
    });

    // Use pre-loaded data if available, otherwise use fetched data
    const wordData = data || (fetchedMeanings && fetchedMeanings.length > 0 ? fetchedMeanings[0] : null);

    // If forced timeout (and still loading or no data), shows not found
    const effectiveLoading = isLoading && !showNotFound;
    const effectiveNotFound = showNotFound || (!effectiveLoading && !wordData);

    // If no word data and no clean word to search, just render text
    if (!data && !open && !cleanWord) return <span>{word}</span>;

    return (
        <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root open={open} onOpenChange={setOpen}>
                <Tooltip.Trigger asChild>
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
                        className="cursor-pointer hover:text-maroon transition-colors decoration-gold/30 hover:underline underline-offset-4 decoration-2 inline-block mx-0.5"
                    >
                        {word}
                    </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="z-50 select-none animate-in fade-in zoom-in-95 duration-200"
                        sideOffset={5}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            className="bg-white border border-border/40 shadow-xl rounded-xl p-5 w-[350px] md:w-[400px] max-w-[90vw] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {effectiveLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-6 h-6 text-maroon animate-spin" />
                                    <span className="ml-2 text-sm text-foreground/60">Searching dictionary...</span>
                                </div>
                            ) : wordData ? (
                                <div className="flex flex-col gap-3">
                                    {/* Header: Word + Gender + Alternate */}
                                    <div className="flex flex-col border-b pb-2">
                                        <div className="flex items-start justify-between">
                                            <span className="text-2xl font-marathi font-bold text-maroon leading-none">
                                                {wordData.devnagri || wordData.word || cleanWord}
                                            </span>
                                            {wordData.gender && (
                                                <span className="text-xs px-2 py-0.5 bg-maroon/10 text-maroon rounded-full font-medium shrink-0 ml-2">
                                                    {wordData.gender === 'm' ? 'पुल्लिंग' : wordData.gender === 'f' ? 'स्त्रीलिंग' : 'नपुंसकलिंग'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Alternate Word / Transliteration */}
                                        {wordData.word_alternate && (
                                            <div className="text-sm text-foreground/60 font-english mt-1">
                                                {wordData.word_alternate}
                                            </div>
                                        )}

                                        {wordData.pronunciation && (
                                            <div className="text-xs italic text-gray-500 font-english mt-0.5">
                                                /{wordData.pronunciation}/
                                            </div>
                                        )}
                                    </div>

                                    {/* Definitions: Primary (Marathi) & Secondary (English) */}
                                    <div className="space-y-3">
                                        {(wordData.definition_primary || wordData.definition_mr) && (
                                            <div className="bg-gold/5 p-2 rounded-lg border border-gold/10">
                                                <div className="text-[9px] uppercase tracking-wider text-gold font-bold mb-1">MARATHI</div>
                                                <p className="text-sm font-marathi text-foreground leading-relaxed font-medium">
                                                    {wordData.definition_primary || wordData.definition_mr}
                                                </p>
                                            </div>
                                        )}

                                        {(wordData.definition_secondary || wordData.definition_en) && (
                                            <div>
                                                <div className="text-[9px] uppercase tracking-wider text-foreground/30 font-bold mb-0.5">ENGLISH</div>
                                                <p className="text-sm font-english text-foreground leading-relaxed">
                                                    {wordData.definition_secondary || wordData.definition_en}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rich Metadata (if strictly available in metadata_json) */}
                                    {wordData.metadata_json && (
                                        <div className="space-y-3 pt-2 border-t border-dashed border-gray-200">
                                            {/* Synonyms */}
                                            {wordData.metadata_json.synonyms?.length > 0 && (
                                                <div>
                                                    <span className="text-[10px] text-foreground/40 uppercase font-bold mr-2">Synonyms:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {wordData.metadata_json.synonyms.map((syn: string, idx: number) => (
                                                            <span key={idx} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors cursor-default">
                                                                {syn}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Antonyms */}
                                            {wordData.metadata_json.antonyms?.length > 0 && (
                                                <div>
                                                    <span className="text-[10px] text-foreground/40 uppercase font-bold mr-2">Antonyms:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {wordData.metadata_json.antonyms.map((ant: string, idx: number) => (
                                                            <span key={idx} className="text-xs px-1.5 py-0.5 bg-red-50 text-red-700 rounded decoration-red-200">
                                                                {ant}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-400 mb-3">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground/80">Definition Not Found</span>
                                    <span className="text-xs text-foreground/40 mt-1 max-w-[200px]">
                                        We couldn't find a dictionary entry for "{cleanWord}".
                                    </span>
                                </div>
                            )}
                            <Tooltip.Arrow className="fill-white border-gold/20" />
                        </motion.div>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
