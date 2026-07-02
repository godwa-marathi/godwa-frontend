"use client";

import React from "react";
import { motion } from "framer-motion";

interface AlphabetStripProps {
    letters: string[];          // letters available in the dataset
    activeLetter: string | null;
    onLetterClick: (letter: string | null) => void;
    allLabel?: string;          // e.g. "All" or "सर्व"
    language?: "devanagari" | "roman";
}

export const AlphabetStrip: React.FC<AlphabetStripProps> = ({
    letters,
    activeLetter,
    onLetterClick,
    allLabel = "All",
    language = "devanagari",
}) => {
    const fontClass = language === "roman" ? "font-english" : "font-marathi";

    return (
        <nav
            aria-label="Filter by first letter"
            className="flex flex-row lg:flex-col gap-0.5 flex-wrap lg:flex-nowrap"
        >
            {/* "All" button */}
            <button
                onClick={() => onLetterClick(null)}
                className={`
                    min-w-[2.25rem] h-9 lg:w-9 lg:h-9 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer
                    ${!activeLetter
                        ? "bg-maroon text-white shadow-sm"
                        : "bg-transparent text-foreground/50 hover:bg-maroon/8 hover:text-maroon"
                    }
                    ${language === "roman" ? "font-english" : "font-marathi"}
                `}
                title={allLabel}
            >
                {allLabel}
            </button>

            {letters.map((letter) => (
                <motion.button
                    key={letter}
                    onClick={() => onLetterClick(letter)}
                    whileTap={{ scale: 0.88 }}
                    className={`
                        min-w-[2.25rem] h-9 lg:w-9 lg:h-9 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer
                        ${activeLetter === letter
                            ? "bg-maroon text-white shadow-sm"
                            : "bg-transparent text-foreground/60 hover:bg-maroon/8 hover:text-maroon"
                        }
                        ${fontClass}
                    `}
                    title={letter}
                    aria-current={activeLetter === letter ? "true" : undefined}
                >
                    {letter}
                </motion.button>
            ))}
        </nav>
    );
};
