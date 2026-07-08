"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    prevLabel?: string;
    nextLabel?: string;
    pageOfLabel?: string;
}

function buildPageRange(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "...")[] = [];
    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");
    pages.push(total);

    return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    prevLabel = "Prev",
    nextLabel = "Next",
    pageOfLabel = "of",
}) => {
    if (totalPages <= 1) return null;

    const pages = buildPageRange(currentPage, totalPages);

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1 pt-8 pb-2"
        >
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-foreground/60 hover:text-maroon hover:bg-maroon/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-english"
            >
                <ChevronLeft className="w-3.5 h-3.5" />
                {prevLabel}
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="w-8 h-8 flex items-center justify-center text-xs text-foreground/30 font-english"
                        >
                            …
                        </span>
                    ) : (
                        <motion.button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            whileTap={{ scale: 0.9 }}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer font-english ${
                                page === currentPage
                                    ? "bg-maroon text-white shadow-sm"
                                    : "text-foreground/60 hover:bg-maroon/8 hover:text-maroon"
                            }`}
                            aria-current={page === currentPage ? "page" : undefined}
                        >
                            {page}
                        </motion.button>
                    )
                )}
            </div>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-foreground/60 hover:text-maroon hover:bg-maroon/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-english"
            >
                {nextLabel}
                <ChevronRight className="w-3.5 h-3.5" />
            </button>
        </nav>
    );
};
