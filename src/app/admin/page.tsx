"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PoemOut, WordOut } from "@/lib/types";
import { Check, X, Wand2, Loader2, AlertCircle, Clock, BookOpen } from "lucide-react";

export default function AdminDashboard() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"submissions" | "words">("submissions");

    // Fetch pending submissions
    const { data: submissions, isLoading: loadingSubs } = useQuery({
        queryKey: ["admin", "submissions"],
        queryFn: () => api.get<PoemOut[]>("/api/admin/poems/submissions"),
    });

    // Fetch words lacking definitions
    const { data: pendingWords, isLoading: loadingWords } = useQuery({
        queryKey: ["admin", "pending-words"],
        queryFn: () => api.get<WordOut[]>("/api/admin/words/pending"),
    });

    // Mutation: Approve Poem
    const approveMutation = useMutation({
        mutationFn: (id: number) => api.post(`/api/admin/poems/submissions/${id}/approve`, {}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] }),
    });

    // Mutation: Enrich Word via AI
    const enrichMutation = useMutation({
        mutationFn: (id: number) => api.post(`/api/admin/words/${id}/enrich-ai`, {}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pending-words"] }),
    });

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-foreground">Admin Center</h1>
                    <p className="text-foreground/60 font-english mt-1">Manage submissions and linguistic enrichment</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white rounded-2xl border border-gold/10 p-1 mb-8 w-fit shadow-sm">
                    <button
                        onClick={() => setActiveTab("submissions")}
                        className={`px-6 py-2.5 rounded-xl font-english font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "submissions" ? "bg-maroon text-white shadow-lg shadow-maroon/20" : "text-foreground/40 hover:text-maroon"
                            }`}
                    >
                        Review Queue
                    </button>
                    <button
                        onClick={() => setActiveTab("words")}
                        className={`px-6 py-2.5 rounded-xl font-english font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "words" ? "bg-maroon text-white shadow-lg shadow-maroon/20" : "text-foreground/40 hover:text-maroon"
                            }`}
                    >
                        Word Enrichment
                    </button>
                </div>

                {activeTab === "submissions" ? (
                    <div className="space-y-4">
                        {loadingSubs ? (
                            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-maroon animate-spin" /></div>
                        ) : submissions?.length ? (
                            submissions.map((poem) => (
                                <div key={poem.id} className="bg-white rounded-2xl border border-gold/10 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center text-gold">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-marathi font-bold text-foreground">{poem.title}</h3>
                                            <div className="text-xs font-english text-foreground/40 flex items-center gap-2">
                                                <span className="font-bold text-gold uppercase tracking-widest">by {poem.poet?.name}</span>
                                                <span>•</span>
                                                <Clock className="w-3 h-3" />
                                                Submitted 2h ago
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 rounded-lg text-foreground/40 hover:bg-gold/5 hover:text-foreground">
                                            <X className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => approveMutation.mutate(poem.id)}
                                            disabled={approveMutation.isPending}
                                            className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-xl font-english font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-maroon/20 transition-all"
                                        >
                                            {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState title="Queue Empty" description="All submissions have been reviewed." />
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loadingWords ? (
                            <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-8 h-8 text-maroon animate-spin" /></div>
                        ) : pendingWords?.length ? (
                            pendingWords.map((word) => (
                                <div key={word.id} className="bg-white rounded-2xl border border-gold/10 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-marathi font-bold text-maroon">{word.devnagri}</span>
                                        <button
                                            onClick={() => enrichMutation.mutate(word.id)}
                                            disabled={enrichMutation.isPending}
                                            className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-all group"
                                            title="Enrich with AI"
                                        >
                                            {enrichMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                                        </button>
                                    </div>
                                    <p className="text-xs font-english text-foreground/40 leading-relaxed">
                                        Lacks definition and linguistic metadata. Click the wand to auto-populate using LLM service.
                                    </p>
                                </div>
                            ))
                        ) : (
                            <EmptyState title="No Pending Words" description="All words in the system are enriched." />
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
