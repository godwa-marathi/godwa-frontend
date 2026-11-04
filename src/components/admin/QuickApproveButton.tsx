"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Zap } from "lucide-react";
import { api } from "@/lib/api";

export interface QuickApproveResult {
    status: string;
    poem_id: number;
    newly_approved: boolean;
    meaning_generated: boolean;
    new_words: number;
    linked_words: number;
    total_words: number;
    words_missing_meaning: number;
}

interface Props {
    poemId: number;
    /** Called after a successful quick approve (e.g. to refetch). */
    onDone?: (result: QuickApproveResult) => void;
    className?: string;
}

/**
 * Admin one-click publish: generate meaning -> tokenize -> approve.
 * Two-step inline confirmation (no browser dialogs) and an inline result message.
 * The API is the real authorization boundary; render this only inside admin pages.
 */
export function QuickApproveButton({ poemId, onDone, className }: Props) {
    const queryClient = useQueryClient();
    const [confirming, setConfirming] = useState(false);

    const mutation = useMutation({
        mutationFn: () => api.post<QuickApproveResult>(`/api/admin/poems/${poemId}/quick-approve`, {}),
        onSuccess: (result) => {
            setConfirming(false);
            queryClient.invalidateQueries({ queryKey: ["admin"] });
            queryClient.invalidateQueries({ queryKey: ["poem"] });
            onDone?.(result);
        },
        onError: () => setConfirming(false),
    });

    const result = mutation.data;
    const error = mutation.error as Error | null;

    return (
        <div className={className}>
            {!confirming ? (
                <button
                    type="button"
                    onClick={() => { mutation.reset(); setConfirming(true); }}
                    disabled={mutation.isPending}
                    title="Generate meaning, tokenize words and publish in one step"
                    className="flex items-center gap-1.5 px-4 py-2 bg-maroon text-white rounded-lg font-english font-bold text-xs uppercase tracking-wider hover:shadow-md hover:shadow-maroon/20 disabled:opacity-50 transition-all"
                >
                    <Zap className="w-3.5 h-3.5" />
                    Quick Approve
                </button>
            ) : (
                <div role="group" aria-label="Confirm quick approve" className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-english text-foreground/70">
                        Generate meaning, tokenize and publish this poem?
                    </span>
                    <button
                        type="button"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg font-english font-bold text-xs uppercase tracking-wider hover:bg-green-700 disabled:opacity-50"
                    >
                        {mutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Confirm
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirming(false)}
                        disabled={mutation.isPending}
                        className="px-3 py-1.5 border border-gold/20 text-foreground/60 rounded-lg font-english font-bold text-xs uppercase tracking-wider hover:bg-gold/5 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div role="status" aria-live="polite" className="mt-2 text-xs font-english">
                {result && (
                    <span className="text-green-700">
                        {result.newly_approved ? "Published." : "Already published."}{" "}
                        {result.meaning_generated ? "Meaning generated. " : ""}
                        {result.total_words} words ({result.new_words} new, {result.linked_words} linked).{" "}
                        {result.words_missing_meaning > 0
                            ? `${result.words_missing_meaning} still have no meaning.`
                            : "All words have a meaning."}
                    </span>
                )}
                {error && <span className="text-red-600">Quick approve failed: {error.message}</span>}
            </div>
        </div>
    );
}
