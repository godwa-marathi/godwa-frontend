"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { LikeResponse } from "@/lib/types";
import Link from "next/link";

interface LikeButtonProps {
    poemId: number;
    initialLikeCount: number;
    initialIsLiked?: boolean | null;
    size?: "sm" | "md" | "lg";
    showCount?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
    poemId,
    initialLikeCount,
    initialIsLiked,
    size = "md",
    showCount = true,
}) => {
    const { token } = useAuth();
    const [isLiked, setIsLiked] = useState(initialIsLiked === true);
    const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const sizeMap = {
        sm: { icon: 16, text: "text-xs", padding: "p-1.5" },
        md: { icon: 20, text: "text-sm", padding: "p-2" },
        lg: { icon: 24, text: "text-base", padding: "p-2.5" },
    };

    const { icon: iconSize, text: textSize, padding } = sizeMap[size];

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000);
            return;
        }

        // Optimistic update
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
        setIsAnimating(true);

        try {
            const response = await api.post<LikeResponse>(`/api/poems/${poemId}/like`, {});
            setIsLiked(response.liked);
            setLikeCount(response.like_count);
        } catch (error) {
            // Revert on error
            setIsLiked(wasLiked);
            setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
            console.error("Failed to toggle like:", error);
        }

        setTimeout(() => setIsAnimating(false), 400);
    };

    return (
        <div className="relative inline-flex items-center">
            <button
                onClick={handleClick}
                className={`${padding} rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                    isLiked
                        ? "text-red-500 hover:text-red-600"
                        : "text-foreground/40 hover:text-red-400"
                }`}
                aria-label={isLiked ? "Unlike poem" : "Like poem"}
            >
                <motion.div
                    animate={isAnimating ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <Heart
                        className={`transition-all duration-200 ${
                            isLiked ? "fill-red-500 stroke-red-500" : "fill-none"
                        }`}
                        style={{ width: iconSize, height: iconSize }}
                    />
                </motion.div>
                {showCount && likeCount > 0 && (
                    <span className={`${textSize} font-english font-medium tabular-nums`}>
                        {likeCount}
                    </span>
                )}
            </button>

            {/* Login prompt tooltip */}
            <AnimatePresence>
                {showLoginPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl border border-gold/10 shadow-lg shadow-gold/10 p-3 z-50"
                    >
                        <p className="text-xs text-foreground/70 text-center font-english mb-2">
                            Sign in to save your favorites
                        </p>
                        <Link
                            href="/auth/login"
                            className="block text-center text-xs font-bold text-maroon hover:text-maroon/80 transition-colors font-english"
                        >
                            Sign In →
                        </Link>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="w-2 h-2 bg-white border-r border-b border-gold/10 rotate-45 transform" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
