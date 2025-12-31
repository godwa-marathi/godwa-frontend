"use client";

import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { WordOut } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WordTooltipProps {
    word: string;
    data?: WordOut;
}

export const WordTooltip: React.FC<WordTooltipProps> = ({ word, data }) => {
    const [open, setOpen] = React.useState(false);
    if (!data) return <span>{word}</span>;

    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root open={open} onOpenChange={setOpen}>
                <Tooltip.Trigger asChild>
                    <span
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer hover:text-maroon transition-colors decoration-gold/30 hover:underline underline-offset-4 decoration-2"
                    >
                        {word}
                    </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="z-50 select-none"
                        sideOffset={5}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="bg-white border-2 border-gold/20 shadow-xl rounded-lg p-4 max-w-xs overflow-hidden"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-2xl font-marathi font-bold text-maroon">
                                        {data.devnagri}
                                    </span>
                                    {data.gender && (
                                        <span className="text-xs px-2 py-0.5 bg-maroon/10 text-maroon rounded-full font-medium">
                                            {data.gender === 'm' ? 'पुल्लिंग' : data.gender === 'f' ? 'स्त्रीलिंग' : 'नपुंसकलिंग'}
                                        </span>
                                    )}
                                </div>

                                {data.pronunciation && (
                                    <div className="text-xs italic text-gray-500 font-english">
                                        /{data.pronunciation}/
                                    </div>
                                )}

                                <div className="space-y-3 mt-1">
                                    {data.definition_mr && (
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-gold font-bold mb-0.5">मराठी</div>
                                            <p className="text-sm font-marathi text-foreground leading-relaxed">
                                                {data.definition_mr}
                                            </p>
                                        </div>
                                    )}
                                    {data.definition_en && (
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-gold font-bold mb-0.5">ENGLISH</div>
                                            <p className="text-sm font-english text-foreground leading-relaxed italic">
                                                {data.definition_en}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Tooltip.Arrow className="fill-white border-gold/20" />
                        </motion.div>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
