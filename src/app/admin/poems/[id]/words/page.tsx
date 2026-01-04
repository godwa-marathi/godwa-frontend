"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { Loader2, ArrowLeft, Sparkles, Check, X, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

interface Word {
    id: number;
    devnagri: string;
    inscript: string | null;
    inscript_doubled: string | null;
    gender: string | null;
    definition_en: string | null;
    definition_mr: string | null;
    pronunciation: string | null;
    related_word_id: number | null;
    metadata_json: any | null;
    status: string;
}

interface PoemWithWords {
    id: number;
    title: string;
    title_roman: string;
    body_marathi: string;
    body_roman: string;
    body_ascii: string;
    poet_id: number;
    book_id: number | null;
    chhanda_id: number | null;
    genre: string;
    description: string | null;
    status: string;
    word_ids: number[];
    words: Word[];
    poet: {
        id: number;
        name: string;
        name_roman: string;
    };
}

export default function WordEnrichmentPage({ params }: Props) {
    const unwrappedParams = React.use(params);
    const { id } = unwrappedParams;
    const { t, language } = useLanguage();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [selectedWordIds, setSelectedWordIds] = useState<Set<number>>(new Set());
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editingWordId, setEditingWordId] = useState<number | null>(null);
    const [editedWord, setEditedWord] = useState<Partial<Word>>({});

    // Fetch poem with words
    const { data: poemData, isLoading, error } = useQuery({
        queryKey: ["poem", "words", id],
        queryFn: () => api.get<PoemWithWords>(`/api/poems/${id}`),
    });

    // Mutation: Bulk enrich words
    const enrichMutation = useMutation({
        mutationFn: (wordIds: number[]) => 
            api.post(`/api/admin/words/bulk_enrich`, { word_ids: wordIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["poem", "words", id] });
            setSelectedWordIds(new Set());
            setToastMessage("Words analyzed successfully!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        },
        onError: (error: any) => {
            setToastMessage(`Analysis failed: ${error.message}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        },
    });

    // Mutation: Bulk approve words
    const approveMutation = useMutation({
        mutationFn: (wordIds: number[]) => 
            api.post(`/api/admin/words/bulk_approve`, { word_ids: wordIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["poem", "words", id] });
            setSelectedWordIds(new Set());
            setToastMessage("Words approved successfully!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        },
        onError: (error: any) => {
            setToastMessage(`Approval failed: ${error.message}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        },
    });

    // Mutation: Update individual word
    const updateWordMutation = useMutation({
        mutationFn: (data: { wordId: number; updates: Partial<Word> }) => 
            api.patch(`/api/admin/words/${data.wordId}`, data.updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["poem", "words", id] });
            setEditingWordId(null);
            setEditedWord({});
            setToastMessage("Word updated successfully!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        },
        onError: (error: any) => {
            setToastMessage(`Update failed: ${error.message}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        },
    });

    const handleSelectAll = () => {
        if (!poemData?.words) return;
        
        if (selectedWordIds.size === poemData.words.length) {
            setSelectedWordIds(new Set());
        } else {
            setSelectedWordIds(new Set(poemData.words.map(w => w.id)));
        }
    };

    const handleSelectWord = (wordId: number) => {
        const newSelected = new Set(selectedWordIds);
        if (newSelected.has(wordId)) {
            newSelected.delete(wordId);
        } else {
            newSelected.add(wordId);
        }
        setSelectedWordIds(newSelected);
    };

    const handleAnalyze = () => {
        if (selectedWordIds.size === 0) return;
        enrichMutation.mutate(Array.from(selectedWordIds));
    };

    const handleApprove = () => {
        if (selectedWordIds.size === 0) return;
        approveMutation.mutate(Array.from(selectedWordIds));
    };

    const handleEditWord = (word: Word) => {
        setEditingWordId(word.id);
        setEditedWord({ ...word });
    };

    const handleCancelEdit = () => {
        setEditingWordId(null);
        setEditedWord({});
    };

    const handleSaveEdit = () => {
        if (editingWordId === null) return;
        updateWordMutation.mutate({ wordId: editingWordId, updates: editedWord });
    };

    const handleFieldChange = (field: keyof Word, value: any) => {
        setEditedWord(prev => ({ ...prev, [field]: value }));
    };

    // Filter words by status
    const filteredWords = poemData?.words.filter(word => {
        if (statusFilter === "all") return true;
        return word.status === statusFilter;
    }) || [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-maroon animate-spin" />
            </div>
        );
    }

    if (error || !poemData) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Poem Not Found</h2>
                    <p className="text-foreground/60 mb-4">The poem with ID {id} could not be found.</p>
                    <Link href="/admin" className="text-maroon hover:underline">Back to Admin</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const allSelected = poemData.words.length > 0 && selectedWordIds.size === poemData.words.length;

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-english font-bold text-foreground/40 hover:text-maroon mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Admin
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                        Word Enrichment
                    </h1>
                    <p className="text-foreground/60 font-english">
                        Review and enrich tokenized words for this poem
                    </p>
                </div>

                {/* Poem Metadata */}
                <div className="mb-8 bg-white rounded-3xl border border-gold/10 shadow-sm p-8">
                    <h2 className="text-xl font-serif font-bold text-foreground mb-6 pb-4 border-b border-gold/10">
                        Poem Metadata
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                Title (Marathi)
                            </label>
                            <p className="text-foreground/80 font-marathi text-lg">
                                {poemData.title || "—"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                Title (Roman)
                            </label>
                            <p className="text-foreground/80 font-english text-lg">
                                {poemData.title_roman || "—"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                Poet
                            </label>
                            <p className="text-foreground/80 font-marathi text-lg">
                                {poemData.poet?.name || "—"}
                                {poemData.poet?.name_roman && (
                                    <span className="text-sm text-foreground/40 font-english ml-2">({poemData.poet.name_roman})</span>
                                )}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                Genre
                            </label>
                            <p className="text-foreground/80 font-english text-lg">
                                {poemData.genre || "—"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                Status
                            </label>
                            <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest border border-gold/20">
                                {poemData.status}
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                Chhanda ID
                            </label>
                            <p className="text-foreground/80 font-english text-lg">
                                {poemData.chhanda_id || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Words Table */}
                <div className="bg-white rounded-3xl border border-gold/10 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gold/10 flex items-center justify-between">
                        <h2 className="text-xl font-serif font-bold text-foreground">
                            Tokenized Words ({filteredWords.length} of {poemData.words.length})
                        </h2>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-gold uppercase tracking-widest">Filter:</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setStatusFilter("all")}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                        statusFilter === "all" 
                                            ? "bg-gold text-white border border-gold" 
                                            : "bg-white text-foreground/60 border border-gold/20 hover:border-gold/40"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStatusFilter("tokenized")}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                        statusFilter === "tokenized"
                                            ? "bg-gray-700 text-white border border-gray-700"
                                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                    }`}
                                >
                                    Tokenized
                                </button>
                                <button
                                    onClick={() => setStatusFilter("analyzed")}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                        statusFilter === "analyzed"
                                            ? "bg-blue-700 text-white border border-blue-700"
                                            : "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200"
                                    }`}
                                >
                                    Analyzed
                                </button>
                                <button
                                    onClick={() => setStatusFilter("approved")}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                        statusFilter === "approved"
                                            ? "bg-green-700 text-white border border-green-700"
                                            : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                                    }`}
                                >
                                    Approved
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gold/5 border-b border-gold/10">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded border-gold/20 text-maroon focus:ring-maroon cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Devanagari</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Inscript</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Inscript Doubled</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Gender</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Definition (EN)</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Definition (MR)</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Pronunciation</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Actions</th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-bold text-gold uppercase tracking-widest">Status</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWords.map((word, index) => {
                                    const rowBgClass = word.status === 'approved' 
                                        ? 'bg-green-50 hover:bg-green-100' 
                                        : word.status === 'analyzed' 
                                        ? 'bg-blue-50 hover:bg-blue-100' 
                                        : 'bg-gray-50 hover:bg-gray-100';
                                    
                                    const isEditing = editingWordId === word.id;
                                    const displayWord = isEditing ? editedWord : word;
                                    
                                    return (
                                    <tr 
                                        key={word.id} 
                                        className={`border-b border-gold/5 transition-colors ${
                                            selectedWordIds.has(word.id) ? 'ring-2 ring-maroon/30' : ''
                                        } ${rowBgClass}`}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedWordIds.has(word.id)}
                                                onChange={() => handleSelectWord(word.id)}
                                                className="w-4 h-4 rounded border-gold/20 text-maroon focus:ring-maroon cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-marathi text-lg text-foreground">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayWord.devnagri || ""}
                                                    onChange={(e) => handleFieldChange("devnagri", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gold/20 rounded font-marathi text-lg"
                                                />
                                            ) : (
                                                word.devnagri
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-english text-sm text-foreground/80">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayWord.inscript || ""}
                                                    onChange={(e) => handleFieldChange("inscript", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gold/20 rounded font-english text-sm"
                                                />
                                            ) : (
                                                word.inscript || "—"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-english text-sm text-foreground/80">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayWord.inscript_doubled || ""}
                                                    onChange={(e) => handleFieldChange("inscript_doubled", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gold/20 rounded font-english text-sm"
                                                />
                                            ) : (
                                                word.inscript_doubled || "—"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-english text-sm text-foreground/80">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayWord.gender || ""}
                                                    onChange={(e) => handleFieldChange("gender", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gold/20 rounded font-english text-sm"
                                                />
                                            ) : (
                                                word.gender || "—"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-english text-sm text-foreground/80 max-w-xs">
                                            {isEditing ? (
                                                <textarea
                                                    value={displayWord.definition_en || ""}
                                                    onChange={(e) => handleFieldChange("definition_en", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gold/20 rounded font-english text-sm resize-none"
                                                    rows={3}
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{word.definition_en || "—"}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-marathi text-sm text-foreground/80 max-w-xs">
                                            {isEditing ? (
                                                <textarea
                                                    value={displayWord.definition_mr || ""}
                                                    onChange={(e) => handleFieldChange("definition_mr", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gold/20 rounded font-marathi text-sm resize-none"
                                                    rows={3}
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{word.definition_mr || "—"}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-english text-sm text-foreground/80">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayWord.pronunciation || ""}
                                                    onChange={(e) => handleFieldChange("pronunciation", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gold/20 rounded font-english text-sm"
                                                />
                                            ) : (
                                                word.pronunciation || "—"
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        disabled={updateWordMutation.isPending}
                                                        className="p-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                                        title="Save"
                                                    >
                                                        {updateWordMutation.isPending ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="p-1.5 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditWord(word)}
                                                    className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                        {/* Status Column - Commented out */}
                                        {/* <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                                word.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                word.status === 'analyzed' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                                {word.status}
                                            </span>
                                        </td> */}
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {poemData.words.length === 0 && (
                        <div className="py-12 text-center text-foreground/40">
                            <p className="font-english">No words found for this poem.</p>
                        </div>
                    )}
                    {poemData.words.length > 0 && filteredWords.length === 0 && (
                        <div className="py-12 text-center text-foreground/40">
                            <p className="font-english">No words match the selected filter.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Action Buttons */}
            {selectedWordIds.size > 0 && (
                <div className="fixed bottom-8 right-8 flex items-center gap-4 z-50">
                    <button
                        onClick={handleApprove}
                        disabled={approveMutation.isPending}
                        className="px-6 py-4 bg-green-600 text-white rounded-2xl font-english font-bold text-sm uppercase tracking-widest shadow-2xl shadow-green-600/40 hover:shadow-3xl hover:scale-105 transition-all flex items-center gap-3"
                    >
                        {approveMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Check className="w-5 h-5" />
                        )}
                        {approveMutation.isPending 
                            ? "Approving..." 
                            : `Approve ${selectedWordIds.size} Word${selectedWordIds.size > 1 ? 's' : ''}`
                        }
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={enrichMutation.isPending}
                        className="px-6 py-4 bg-maroon text-white rounded-2xl font-english font-bold text-sm uppercase tracking-widest shadow-2xl shadow-maroon/40 hover:shadow-3xl hover:scale-105 transition-all flex items-center gap-3"
                    >
                        {enrichMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        {enrichMutation.isPending 
                            ? "Analyzing..." 
                            : `Analyze ${selectedWordIds.size} Word${selectedWordIds.size > 1 ? 's' : ''}`
                        }
                    </button>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gold/20 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 z-50 animate-fade-in">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="font-english font-medium text-foreground">{toastMessage}</p>
                </div>
            )}

            <Footer />
        </main>
    );
}
