"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { PoetOut } from "@/lib/types";

/** Admin-only inline poet editor. Renders nothing for everyone else. */
export function AdminPoetTools({ poet }: { poet: PoetOut }) {
    const { user } = useAuth();
    if (!user?.is_admin) return null;
    return <PoetEditor poet={poet} />;
}

function PoetEditor({ poet }: { poet: PoetOut }) {
    const qc = useQueryClient();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const initial = {
        name: poet.name ?? "",
        name_roman: poet.name_roman ?? "",
        pet_name: poet.pet_name ?? "",
        bio: poet.bio ?? "",
        image_url: poet.image_url ?? "",
        date_of_birth: poet.date_of_birth ?? "",
        date_of_death: poet.date_of_death ?? "",
        instagram_url: poet.instagram_url ?? "",
        youtube_url: poet.youtube_url ?? "",
        contact_email: poet.contact_email ?? "",
        website_url: poet.website_url ?? "",
    };
    const [form, setForm] = useState(initial);
    type Key = keyof typeof initial;

    const save = useMutation({
        mutationFn: async () => {
            const body: Record<string, string | null> = {};
            (Object.keys(initial) as Key[]).forEach((k) => {
                if (form[k] !== initial[k]) {
                    // Dates cannot be sent as "" (invalid date): clear them with null.
                    body[k] = form[k] === "" && k.startsWith("date_") ? null : form[k];
                }
            });
            if (Object.keys(body).length === 0) return null;
            return api.patch<PoetOut>(`/api/admin/poets/${poet.id}`, body);
        },
        onSuccess: () => {
            setError("");
            qc.invalidateQueries({ queryKey: ["poet"] });
            qc.invalidateQueries({ queryKey: ["poets"] });
            setOpen(false);
        },
        onError: (e: Error) => setError(e.message),
    });

    const input = "w-full px-3 py-2 border border-gold/20 rounded-lg bg-white text-sm outline-none focus:border-maroon";
    const label = "text-[10px] font-bold uppercase tracking-widest text-gold";
    const field = (k: Key, text: string, type = "text", placeholder?: string) => (
        <label className="block space-y-1">
            <span className={label}>{text}</span>
            <input
                className={input}
                type={type}
                placeholder={placeholder}
                value={form[k]}
                onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
            />
        </label>
    );

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-maroon text-white text-xs font-bold uppercase tracking-wider">
                <Pencil className="w-3.5 h-3.5" /> Edit poet
            </button>
        );
    }

    return (
        <form
            aria-label="Edit poet"
            className="rounded-2xl border border-dashed border-maroon/30 bg-white/70 p-4 space-y-3 text-left"
            onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        >
            <div className="flex items-start gap-3">
                {form.image_url ? (
                    <img
                        src={form.image_url}
                        alt={form.name || "Poet"}
                        className="w-16 h-16 rounded-full object-cover border border-gold/20 shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
                        onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "visible"; }}
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 shrink-0" aria-hidden />
                )}
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                    {field("name", "Name")}
                    {field("name_roman", "Name (Roman)")}
                    {field("pet_name", "Pen name")}
                    {field("image_url", "Image URL", "url")}
                    {field("date_of_birth", "Born", "date")}
                    {field("date_of_death", "Died", "date")}
                </div>
            </div>
            <label className="block space-y-1">
                <span className={label}>Bio</span>
                <textarea className={`${input} min-h-28`} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
            </label>
            <fieldset className="grid md:grid-cols-2 gap-3">
                <legend className={`${label} mb-1`}>Links (optional)</legend>
                {field("instagram_url", "Instagram", "url", "https://instagram.com/…")}
                {field("youtube_url", "YouTube", "url", "https://youtube.com/…")}
                {field("contact_email", "Email", "email")}
                {field("website_url", "Website", "url", "https://…")}
            </fieldset>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
                <button type="submit" disabled={save.isPending} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50">
                    {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                </button>
                <button type="button" onClick={() => { setOpen(false); setForm(initial); setError(""); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold/20 text-xs font-bold uppercase tracking-wider text-foreground/60">
                    <X className="w-4 h-4" /> Cancel
                </button>
            </div>
        </form>
    );
}
