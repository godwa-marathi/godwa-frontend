"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminGuard } from "@/components/AdminGuard";
import { api } from "@/lib/api";
import { TagOut, TagWithCount } from "@/lib/types";

export default function AdminTagsPage() {
    return (
        <AdminGuard>
            <AdminTags />
        </AdminGuard>
    );
}

function AdminTags() {
    const qc = useQueryClient();
    const [name, setName] = useState("");
    const [isCategory, setIsCategory] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [error, setError] = useState("");

    const { data: tags, isLoading } = useQuery({
        queryKey: ["admin", "tags"],
        queryFn: () => api.get<TagWithCount[]>("/api/admin/tags"),
    });

    const refresh = () => {
        qc.invalidateQueries({ queryKey: ["admin", "tags"] });
        qc.invalidateQueries({ queryKey: ["tags"] });
    };
    const onError = (e: Error) => setError(e.message);

    const create = useMutation({
        mutationFn: () => api.post<TagOut>("/api/admin/tags", { name, is_category: isCategory }),
        onSuccess: () => { setName(""); setError(""); refresh(); },
        onError,
    });
    const update = useMutation({
        mutationFn: (v: { id: number; body: { name?: string; is_category?: boolean } }) =>
            api.patch<TagOut>(`/api/admin/tags/${v.id}`, v.body),
        onSuccess: () => { setEditingId(null); setError(""); refresh(); },
        onError,
    });
    const remove = useMutation({
        mutationFn: (id: number) => api.delete<{ deleted: boolean; unlinked_poems: number }>(`/api/admin/tags/${id}`),
        onSuccess: () => { setError(""); refresh(); },
        onError,
    });

    const confirmDelete = (tag: TagWithCount) => {
        const used = tag.poem_count
            ? `It will be removed from ${tag.poem_count} poem${tag.poem_count === 1 ? "" : "s"}.`
            : "It is not used by any poem.";
        if (window.confirm(`Delete ${tag.is_category ? "category" : "tag"} "${tag.name}"? ${used}`)) {
            remove.mutate(tag.id);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <section className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-english font-bold text-foreground/40 hover:text-maroon mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Admin
                </Link>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Tags & Categories</h1>
                <p className="text-foreground/60 font-english mb-8">
                    Categories fill the dropdown on the submit form and are tags too. Other tags are added freely by contributors.
                </p>

                <form
                    className="flex flex-wrap items-center gap-3 bg-white border border-gold/10 rounded-2xl p-4 mb-6"
                    onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(); }}
                >
                    <input
                        aria-label="New tag name"
                        value={name}
                        maxLength={30}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="New tag or category"
                        className="flex-1 min-w-[12rem] px-4 py-2 border border-gold/10 rounded-xl outline-none focus:border-maroon font-marathi"
                    />
                    <label className="flex items-center gap-2 text-sm font-english">
                        <input type="checkbox" checked={isCategory} onChange={(e) => setIsCategory(e.target.checked)} />
                        Category (dropdown)
                    </label>
                    <button
                        type="submit"
                        disabled={create.isPending || !name.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-maroon text-white rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </form>

                {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}

                {isLoading ? (
                    <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 text-maroon animate-spin" /></div>
                ) : (
                    <ul className="space-y-2">
                        {(tags ?? []).map((tag) => (
                            <li key={tag.id} className="bg-white border border-gold/10 rounded-xl p-3 flex flex-wrap items-center gap-3">
                                {editingId === tag.id ? (
                                    <>
                                        <input
                                            aria-label={`Rename ${tag.name}`}
                                            value={editName}
                                            maxLength={30}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 min-w-[10rem] px-3 py-1.5 border border-gold/20 rounded-lg font-marathi"
                                        />
                                        <button aria-label="Save name" onClick={() => update.mutate({ id: tag.id, body: { name: editName } })} className="p-2 text-green-700 hover:bg-green-50 rounded-lg">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button aria-label="Cancel rename" onClick={() => setEditingId(null)} className="p-2 text-foreground/50 hover:bg-gold/5 rounded-lg">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="flex-1 font-marathi font-semibold">{tag.name}</span>
                                        <span className="text-xs text-foreground/40 font-english">{tag.poem_count} poems</span>
                                        <label className="flex items-center gap-1.5 text-xs font-english">
                                            <input
                                                type="checkbox"
                                                aria-label={`${tag.name} is a category`}
                                                checked={tag.is_category}
                                                onChange={(e) => update.mutate({ id: tag.id, body: { is_category: e.target.checked } })}
                                            />
                                            Category
                                        </label>
                                        <button aria-label={`Rename ${tag.name}`} onClick={() => { setEditingId(tag.id); setEditName(tag.name); }} className="p-2 text-foreground/50 hover:bg-gold/5 rounded-lg">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button aria-label={`Delete ${tag.name}`} onClick={() => confirmDelete(tag)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                        {tags && tags.length === 0 && <li className="text-center text-foreground/40 py-10 font-english">No tags yet.</li>}
                    </ul>
                )}
            </section>
            <Footer />
        </main>
    );
}
