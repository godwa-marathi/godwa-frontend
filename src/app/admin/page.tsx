"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { PoemOut, PoetOut } from "@/lib/types";
import { Check, X, Loader2, AlertCircle, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const queryClient = useQueryClient();
    const { language, t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"review" | "tokenized" | "approved">("review");

    // Fetch pending submissions (review queue)
    const { data: submissions, isLoading: loadingSubs } = useQuery({
        queryKey: ["admin", "submissions"],
        queryFn: () => api.get<PoemOut[]>("/api/poems?status=pending"),
        enabled: activeTab === "review",
    });

    // Fetch tokenized poems
    const { data: tokenizedPoems, isLoading: loadingTokenized } = useQuery({
        queryKey: ["admin", "tokenized"],
        queryFn: () => api.get<PoemOut[]>("/api/poems?status=tokenized"),
        enabled: activeTab === "tokenized",
    });

    // Fetch approved poems
    const { data: approvedPoems, isLoading: loadingApproved } = useQuery({
        queryKey: ["admin", "approved"],
        queryFn: () => api.get<PoemOut[]>("/api/poems?status=approved"),
        enabled: activeTab === "approved",
    });

    // Fetch reference data for lookups
    const { data: poets } = useQuery({
        queryKey: ["poets"],
        queryFn: () => api.get<PoetOut[]>("/api/poets/"),
    });

    // Fetch chhandas (simulated or real endpoint if available, assuming /api/chhandas/ exists or we use ID)
    // Since I don't see a clear chhanda list endpoint in my search, I will start with poets which is the critical request.
    // If chhanda names are needed and not in the poem object, we might need to fetch them too.
    // However, the interface has chhanda_name? in PoemOut. Let's see if we can rely on that or ID.
    // The user specifically asked for chhanda_id, but poet NAME.

    // Create lookup maps
    const poetMap = React.useMemo(() => {
        if (!poets) return new Map<number, PoetOut>();
        return new Map(poets.map(p => [p.id, p]));
    }, [poets]);

    // Mutation: Approve Poem
    const approveMutation = useMutation({
        mutationFn: (id: number) => api.post(`/api/admin/poems/submissions/${id}/approve`, {}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] }),
    });

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-foreground">{t.admin_title}</h1>
                    <p className="text-foreground/60 font-english mt-1">{t.admin_subtitle}</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white rounded-2xl border border-gold/10 p-1 mb-8 w-fit shadow-sm">
                    <button
                        onClick={() => setActiveTab("review")}
                        className={`px-6 py-2.5 rounded-xl font-english font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "review" ? "bg-maroon text-white shadow-lg shadow-maroon/20" : "text-foreground/40 hover:text-maroon"
                            }`}
                    >
                        Review Queue
                    </button>
                    <button
                        onClick={() => setActiveTab("tokenized")}
                        className={`px-6 py-2.5 rounded-xl font-english font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "tokenized" ? "bg-maroon text-white shadow-lg shadow-maroon/20" : "text-foreground/40 hover:text-maroon"
                            }`}
                    >
                        Tokenized Poems
                    </button>
                    <button
                        onClick={() => setActiveTab("approved")}
                        className={`px-6 py-2.5 rounded-xl font-english font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "approved" ? "bg-maroon text-white shadow-lg shadow-maroon/20" : "text-foreground/40 hover:text-maroon"
                            }`}
                    >
                        Approved Poems
                    </button>
                </div>

                {activeTab === "review" && (
                    <div className="space-y-4">
                        {loadingSubs ? (
                            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-maroon animate-spin" /></div>
                        ) : submissions?.length ? (
                            submissions.map((item: any) => {
                                // Handle potential nested structure (Submission wrapper vs direct Poem)
                                const poem = item.poem || item;
                                // Robustly determine ID: poem.id, item.poem_id, or item.id
                                const poemId = poem.id || item.poem_id || (item.poem ? undefined : item.id);

                                // Debug logging
                                // console.log('Submission item:', item);
                                // console.log('Poem object:', poem);
                                // console.log('Resolved Poem ID:', poemId);

                                const poet = poem.poet || poetMap.get(poem.poet_id);
                                const poetName = language === "devanagari"
                                    ? (poet?.name || "Unknown Poet")
                                    : (poet?.name_roman || poet?.name || "Unknown Poet");

                                if (!poemId) {
                                    console.error("Could not resolve poem ID for item:", item);
                                    return null; // Skip invalid items
                                }

                                return (
                                    <div key={poemId} className="bg-white rounded-2xl border border-gold/10 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                        <Link href={`/admin/submissions/${poemId}`} className="flex items-center gap-6 flex-1 group cursor-pointer">
                                            <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold text-foreground group-hover:text-maroon transition-colors ${language === "devanagari" ? "font-marathi" : "font-english"}`}>
                                                    {language === "devanagari"
                                                        ? (poem.title || poem.title_roman)
                                                        : (poem.title_roman || poem.title)}
                                                </h3>
                                                <div className="text-xs font-english text-foreground/40 flex items-center gap-2">
                                                    <span className="font-bold text-gold uppercase tracking-widest">by {poetName}</span>
                                                    <span>•</span>
                                                    <span className="text-foreground/60">
                                                        Chhanda ID: {poem.chhanda_id ?? "N/A"}
                                                    </span>
                                                    <span>•</span>
                                                    <Clock className="w-3 h-3" />
                                                    Submitted 2h ago
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })

                        ) : (
                            <EmptyState title={t.admin_queue_empty} description="" />
                        )}
                    </div>
                )}

                {activeTab === "tokenized" && (
                    <div className="space-y-4">
                        {loadingTokenized ? (
                            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-maroon animate-spin" /></div>
                        ) : tokenizedPoems?.length ? (
                            tokenizedPoems.map((item: any) => {
                                const poem = item.poem || item;
                                const poemId = poem.id || item.poem_id || (item.poem ? undefined : item.id);
                                const poet = poem.poet || poetMap.get(poem.poet_id);
                                const poetName = language === "devanagari"
                                    ? (poet?.name || "Unknown Poet")
                                    : (poet?.name_roman || poet?.name || "Unknown Poet");

                                if (!poemId) return null;

                                return (
                                    <div key={poemId} className="bg-white rounded-2xl border border-gold/10 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                        <Link href={`/admin/poems/${poemId}/words`} className="flex items-center gap-6 flex-1 group cursor-pointer">
                                            <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold text-foreground group-hover:text-maroon transition-colors ${language === "devanagari" ? "font-marathi" : "font-english"}`}>
                                                    {language === "devanagari"
                                                        ? (poem.title || poem.title_roman)
                                                        : (poem.title_roman || poem.title)}
                                                </h3>
                                                <div className="text-xs font-english text-foreground/40 flex items-center gap-2">
                                                    <span className="font-bold text-gold uppercase tracking-widest">by {poetName}</span>
                                                    <span>•</span>
                                                    <span className="text-foreground/60">
                                                        Genre: {poem.genre || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => approveMutation.mutate(poemId)}
                                                disabled={approveMutation.isPending}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-english font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-green-600/20 transition-all"
                                            >
                                                {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <EmptyState title="No Tokenized Poems" description="Tokenize poems to see them here" />
                        )}
                    </div>
                )}

                {activeTab === "approved" && (
                    <div className="space-y-4">
                        {loadingApproved ? (
                            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-maroon animate-spin" /></div>
                        ) : approvedPoems?.length ? (
                            approvedPoems.map((item: any) => {
                                const poem = item.poem || item;
                                const poemId = poem.id || item.poem_id || (item.poem ? undefined : item.id);
                                const poet = poem.poet || poetMap.get(poem.poet_id);
                                const poetName = language === "devanagari"
                                    ? (poet?.name || "Unknown Poet")
                                    : (poet?.name_roman || poet?.name || "Unknown Poet");

                                if (!poemId) return null;

                                return (
                                    <div key={poemId} className="bg-white rounded-2xl border border-gold/10 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                        <Link href={`/admin/submissions/${poemId}`} className="flex items-center gap-6 flex-1 group cursor-pointer">
                                            <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold text-foreground group-hover:text-maroon transition-colors ${language === "devanagari" ? "font-marathi" : "font-english"}`}>
                                                    {language === "devanagari"
                                                        ? (poem.title || poem.title_roman)
                                                        : (poem.title_roman || poem.title)}
                                                </h3>
                                                <div className="text-xs font-english text-foreground/40 flex items-center gap-2">
                                                    <span className="font-bold text-gold uppercase tracking-widest">by {poetName}</span>
                                                    <span>•</span>
                                                    <span className="text-foreground/60">
                                                        Genre: {poem.genre || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        ) : (
                            <EmptyState title="No Approved Poems" description="Approve poems to see them here" />
                        )}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}

function EmptyState({ title, description }: { title: string, description: string }) {
    return (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gold/30">
            <AlertCircle className="w-12 h-12 text-gold/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-foreground">{title}</h3>
            <p className="text-foreground/60 font-english mt-1">{description}</p>
        </div>
    );
}
