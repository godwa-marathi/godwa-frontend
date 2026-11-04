"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, History, Loader2, Pencil, Save, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { PoemOut, PoetOut, PoetMiniOut, TagWithCount } from "@/lib/types";
import { TagInput } from "@/components/TagInput";

export interface ChangelogEntry {
    id: number;
    action: string;
    created_at: string | null;
    admin: { id: number; name: string } | null;
    changes: Record<string, any>;
}

const ACTION_LABELS: Record<string, string> = {
    edit: "Edited",
    generate_meaning: "Generated meaning",
    tokenize: "Tokenized words",
    approve: "Approved",
    quick_approve: "Quick approved",
};

const show = (v: unknown) =>
    v === null || v === undefined || v === "" ? "∅" : Array.isArray(v) ? v.join(", ") || "∅" : String(v);

/** Admin-only wrapper: renders nothing (and fetches nothing) for everyone else. */
export function AdminPoemTools({ poem, poet }: { poem: PoemOut; poet?: PoetOut | null }) {
    const { user } = useAuth();
    if (!user?.is_admin) return null;
    return <AdminPoemToolsInner poem={poem} poet={poet} />;
}

function AdminPoemToolsInner({ poem, poet }: { poem: PoemOut; poet?: PoetOut | null }) {
    const [editing, setEditing] = useState(false);
    const [showLog, setShowLog] = useState(false);

    return (
        <section aria-label="Admin tools" className="mt-8 rounded-2xl border border-dashed border-maroon/30 bg-white/60 p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-maroon/60">Admin</span>
                {!editing && (
                    <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-maroon text-white text-xs font-bold uppercase tracking-wider">
                        <Pencil className="w-3.5 h-3.5" /> Edit poem
                    </button>
                )}
                <button
                    onClick={() => setShowLog((s) => !s)}
                    aria-expanded={showLog}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-maroon/20 text-maroon text-xs font-bold uppercase tracking-wider"
                >
                    <History className="w-3.5 h-3.5" /> Changelog {showLog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
            </div>

            {editing && <PoemEditForm poem={poem} poet={poet} onClose={() => setEditing(false)} />}
            {showLog && <ChangelogPanel poemId={poem.id} />}
        </section>
    );
}

function PoemEditForm({ poem, poet, onClose }: { poem: PoemOut; poet?: PoetOut | null; onClose: () => void }) {
    const qc = useQueryClient();
    const currentCategory = poem.tags?.find((t) => t.is_category)?.name ?? poem.genre ?? "";
    const currentTags = (poem.tags ?? []).filter((t) => !t.is_category).map((t) => t.name);
    const currentPoetName = poet?.name ?? poem.poet?.name ?? "";

    const initial = {
        title: poem.title ?? "",
        title_roman: poem.title_roman ?? "",
        body_marathi: poem.body_marathi ?? "",
        body_roman: poem.body_roman ?? "",
        body_meaning: poem.body_meaning ?? "",
        description: poem.description ?? "",
        poet_name: currentPoetName,
        category: currentCategory,
        tags: currentTags,
        instagram_url: poem.instagram_url ?? "",
        youtube_url: poem.youtube_url ?? "",
        contact_email: poem.contact_email ?? "",
        website_url: poem.website_url ?? "",
    };
    const [form, setForm] = useState(initial);
    const [error, setError] = useState("");

    const { data: categories } = useQuery({
        queryKey: ["tags", "categories"],
        queryFn: () => api.get<TagWithCount[]>("/api/tags?categories_only=true"),
        staleTime: 60_000,
    });

    // All poets, so the poet-name field can autocomplete to an existing poet
    // (typing an exact existing name reassigns on the backend instead of making
    // a duplicate; a brand-new name renames/creates as before).
    const { data: allPoets } = useQuery({
        queryKey: ["poets", "all"],
        queryFn: () => api.get<PoetMiniOut[]>("/api/poets/all"),
        staleTime: 60_000,
    });

    const save = useMutation({
        mutationFn: async () => {
            // Send only what changed so we never overwrite untouched fields.
            const body: Record<string, unknown> = {};
            (Object.keys(initial) as (keyof typeof initial)[]).forEach((k) => {
                if (JSON.stringify(form[k]) !== JSON.stringify(initial[k])) body[k] = form[k];
            });
            if (Object.keys(body).length === 0) return null;
            return api.patch<PoemOut>(`/api/admin/poems/${poem.id}`, body);
        },
        onSuccess: () => {
            setError("");
            qc.invalidateQueries({ queryKey: ["poem"] });
            qc.invalidateQueries({ queryKey: ["poet"] });
            qc.invalidateQueries({ queryKey: ["admin", "changelog", poem.id] });
            qc.invalidateQueries({ queryKey: ["poems"] });
            onClose();
        },
        onError: (e: Error) => setError(e.message),
    });

    const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const input = "w-full px-3 py-2 border border-gold/20 rounded-lg bg-white text-sm outline-none focus:border-maroon";
    const label = "text-[10px] font-bold uppercase tracking-widest text-gold";

    const field = (k: keyof typeof initial, text: string, extra: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {}) => (
        <label className="block space-y-1">
            <span className={label}>{text}</span>
            <input className={input} value={form[k] as string} onChange={set(k)} {...extra} />
        </label>
    );

    return (
        <form
            aria-label="Edit poem"
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        >
            <div className="grid md:grid-cols-2 gap-3">
                {field("title", "Title")}
                {field("title_roman", "Title (Roman)")}
                <label className="block space-y-1">
                    <span className={label}>Poet name</span>
                    <input
                        className={input}
                        list="admin-poet-options"
                        value={form.poet_name}
                        onChange={set("poet_name")}
                        placeholder="Type to search existing poets, or enter a new name"
                        aria-label="Poet name"
                    />
                    <datalist id="admin-poet-options">
                        {(allPoets ?? []).map((p) => (
                            <option key={p.id} value={p.name}>{p.name_roman || ""}</option>
                        ))}
                    </datalist>
                    <span className="text-[10px] text-foreground/40 font-english">
                        Pick an existing poet to reassign; a new name renames this poem&apos;s poet.
                    </span>
                </label>
                <label className="block space-y-1">
                    <span className={label}>Category</span>
                    <select className={input} value={form.category} onChange={set("category")} aria-label="Category">
                        <option value="">— none —</option>
                        {form.category && !(categories ?? []).some((c) => c.name === form.category) && (
                            <option value={form.category}>{form.category}</option>
                        )}
                        {(categories ?? []).map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </label>
            </div>

            <label className="block space-y-1">
                <span className={label}>Poem (Marathi)</span>
                <textarea className={`${input} font-marathi min-h-40`} value={form.body_marathi} onChange={set("body_marathi")} />
            </label>
            <label className="block space-y-1">
                <span className={label}>Poem (Roman)</span>
                <textarea className={`${input} min-h-32`} value={form.body_roman} onChange={set("body_roman")} />
            </label>
            <label className="block space-y-1">
                <span className={label}>Line-by-line meaning</span>
                <textarea className={`${input} min-h-32`} value={form.body_meaning} onChange={set("body_meaning")} />
            </label>
            <label className="block space-y-1">
                <span className={label}>Description</span>
                <textarea className={input} value={form.description} onChange={set("description")} />
            </label>

            <div className="space-y-1">
                <span className={label}>Tags</span>
                <TagInput value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} label="Poem tags" />
            </div>

            <fieldset className="grid md:grid-cols-2 gap-3">
                <legend className={`${label} mb-1`}>Poem links (optional)</legend>
                {field("instagram_url", "Instagram", { type: "url", placeholder: "https://instagram.com/…" })}
                {field("youtube_url", "YouTube", { type: "url", placeholder: "https://youtube.com/…" })}
                {field("contact_email", "Email", { type: "email" })}
                {field("website_url", "Website", { type: "url", placeholder: "https://…" })}
            </fieldset>

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
                <button type="submit" disabled={save.isPending} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50">
                    {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                </button>
                <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold/20 text-xs font-bold uppercase tracking-wider text-foreground/60">
                    <X className="w-4 h-4" /> Cancel
                </button>
            </div>
        </form>
    );
}

function ChangelogPanel({ poemId }: { poemId: number }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["admin", "changelog", poemId],
        queryFn: () => api.get<ChangelogEntry[]>(`/api/admin/poems/${poemId}/changelog`),
    });

    if (isLoading) return <Loader2 className="w-5 h-5 animate-spin text-maroon" aria-label="Loading changelog" />;
    if (error) return <p role="alert" className="text-sm text-red-600">{(error as Error).message}</p>;
    if (!data?.length) return <p className="text-sm text-foreground/50 font-english">No changes recorded yet.</p>;

    return (
        <ol aria-label="Changelog" className="space-y-3">
            {data.map((entry) => (
                <li key={entry.id} className="rounded-lg border border-gold/15 bg-white p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/50 font-english">
                        <strong className="text-maroon">{ACTION_LABELS[entry.action] ?? entry.action}</strong>
                        <span>by {entry.admin?.name ?? "unknown"}</span>
                        {entry.created_at && <time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>}
                    </div>
                    <ul className="mt-2 space-y-1">
                        {Object.entries(entry.changes).map(([field, change]) => (
                            <li key={field} className="font-english">
                                <span className="font-semibold">{field}</span>:{" "}
                                {change && typeof change === "object" && "old" in change ? (
                                    <>
                                        <span className="text-red-700/80 line-through break-words">{show(change.old)}</span>{" "}
                                        → <span className="text-green-700 break-words">{show(change.new)}</span>
                                    </>
                                ) : (
                                    <span className="text-foreground/70">{JSON.stringify(change)}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ol>
    );
}
