"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { TagWithCount } from "@/lib/types";

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    max?: number;
    maxLength?: number;
    placeholder?: string;
    label?: string;
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim().replace(/^#+/, "").trim();
const key = (s: string) => norm(s).toLocaleLowerCase();

/** Chip input with autocomplete from existing tags. Enter or comma adds, Backspace removes the last chip. */
export function TagInput({ value, onChange, max = 10, maxLength = 30, placeholder, label = "Tags" }: TagInputProps) {
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");

    const q = norm(draft);
    const { data: suggestions } = useQuery({
        queryKey: ["tags", "suggest", q],
        queryFn: () => api.get<TagWithCount[]>(`/api/tags?q=${encodeURIComponent(q)}&limit=8`),
        enabled: q.length >= 1,
        staleTime: 30_000,
    });

    const add = (raw: string) => {
        const name = norm(raw);
        if (!name) return;
        if (name.length > maxLength) {
            setError(`Tags can be at most ${maxLength} characters`);
            return;
        }
        if (value.some((v) => key(v) === key(name))) {
            setDraft("");
            return;
        }
        if (value.length >= max) {
            setError(`You can add up to ${max} tags`);
            return;
        }
        setError("");
        onChange([...value, name]);
        setDraft("");
    };

    const visible = (suggestions ?? []).filter(
        (s) => !s.is_category && !value.some((v) => key(v) === key(s.name))
    );

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-white border border-gold/10 rounded-xl focus-within:ring-2 focus-within:ring-maroon/20 focus-within:border-maroon transition-all">
                {value.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 text-maroon text-xs font-medium">
                        {tag}
                        <button
                            type="button"
                            aria-label={`Remove tag ${tag}`}
                            onClick={() => onChange(value.filter((v) => v !== tag))}
                            className="hover:text-red-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    aria-label={label}
                    value={draft}
                    placeholder={value.length === 0 ? placeholder : ""}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v.includes(",")) {
                            v.split(",").forEach((part, i, arr) => i < arr.length - 1 && add(part));
                            setDraft(v.split(",").pop() ?? "");
                        } else {
                            setDraft(v);
                            setError("");
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            add(draft);
                        } else if (e.key === "Backspace" && !draft && value.length) {
                            onChange(value.slice(0, -1));
                        }
                    }}
                    className="flex-1 min-w-[8rem] py-1 outline-none bg-transparent font-marathi text-sm"
                />
            </div>
            {visible.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Tag suggestions">
                    {visible.map((s) => (
                        <li key={s.id}>
                            <button
                                type="button"
                                onClick={() => add(s.name)}
                                className="px-2.5 py-1 rounded-full border border-gold/20 text-xs text-foreground/70 hover:bg-gold/10"
                            >
                                + {s.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
