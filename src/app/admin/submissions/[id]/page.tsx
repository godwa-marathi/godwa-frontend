"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { PoemOut } from "@/lib/types";
import { Loader2, ArrowLeft, Check, X, User, Edit3, Link2, Unlink, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sanscript from "@indic-transliteration/sanscript";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default function SubmissionDetailPage({ params }: Props) {
    // Next.js 15: params is now a Promise, must unwrap it
    const unwrappedParams = React.use(params);
    const { id } = unwrappedParams;
    const { t, language } = useLanguage();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Edit state
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState("");
    const [editedTitleRoman, setEditedTitleRoman] = React.useState("");
    const [editedMarathi, setEditedMarathi] = React.useState("");
    const [editedRoman, setEditedRoman] = React.useState("");
    const [editedGenre, setEditedGenre] = React.useState("");
    const [editedDescription, setEditedDescription] = React.useState("");
    const [editedPoetName, setEditedPoetName] = React.useState("");
    const [editedPoetId, setEditedPoetId] = React.useState<number | null>(null);
    const [editedChandaId, setEditedChandaId] = React.useState<number | null>(null);
    const [editedChandaName, setEditedChandaName] = React.useState(""); // For input display
    const [chhandaSuggestions, setChhandaSuggestions] = React.useState<any[]>([]);
    const [isSearchingChhanda, setIsSearchingChhanda] = React.useState(false);

    const [editedMetadata, setEditedMetadata] = React.useState("");
    const [editedSearchSlug, setEditedSearchSlug] = React.useState("");
    const [poetSuggestions, setPoetSuggestions] = React.useState<any[]>([]);
    const [isSearchingPoets, setIsSearchingPoets] = React.useState(false);
    // Genre state
    const [isSearchingGenre, setIsSearchingGenre] = React.useState(false);
    const [genreSuggestions, setGenreSuggestions] = React.useState<string[]>([]);

    // Note: COMMON_GENRES and COMMON_CHHANDAS removed. Using API data only.

    const [autoSync, setAutoSync] = React.useState(false);

    // Fetch poem details using /api/poems/{id}
    const { data: poem, isLoading, error } = useQuery({
        queryKey: ["poem", id],
        queryFn: () => api.get<PoemOut>(`/api/poems/${id}`),
    });

    // Fetch poets for lookup
    const { data: poets } = useQuery({
        queryKey: ["poets"],
        queryFn: () => api.get<any[]>("/api/poets/"),
    });

    // Fetch chhandas
    const { data: chhandas } = useQuery({
        queryKey: ["chhandas"],
        queryFn: async () => {
            // User specified endpoint: /api/chhanda/list
            try {
                return await api.get<any[]>("/api/chhanda/list");
            } catch (e) {
                console.warn("Failed to fetch chhandas", e);
                return [];
            }
        },
    });

    // Fetch genres
    const { data: genres } = useQuery({
        queryKey: ["genres"],
        queryFn: async () => {
            // Assuming endpoint: /api/genres/
            // If this doesn't exist, we might need a fallback or verify with user.
            // For now, attempting to fetch.
            try {
                // Return type might be string[] or object[]. Assuming string[] or {name: string}[]? 
                // Let's assume it returns a list of objects or strings. 
                // Adjusting based on common API patterns: likely a list of strings or objects.
                // If it fails, empty list.
                const res = await api.get<any[]>("/api/genres/");
                return res;
            } catch (e) {
                console.warn("Failed to fetch genres", e);
                return [];
            }
        },
    });

    // Get poet info
    const poet = React.useMemo(() => {
        if (!poem) return null;
        if (poem.poet) return poem.poet;
        if (poets && poem.poet_id) {
            return poets.find((p: any) => p.id === poem.poet_id);
        }
        return null;
    }, [poem, poets]);

    // Initialize edit state when poem loads
    React.useEffect(() => {
        if (poem) {
            console.log("Initializing edit state with poem data:", poem);
            setEditedTitle(poem.title || "");
            setEditedTitleRoman(poem.title_roman || "");
            setEditedMarathi(poem.body_marathi || "");
            setEditedRoman(poem.body_roman || "");
            setEditedGenre(poem.genre || "");
            setEditedDescription(poem.description || "");
            setEditedPoetId(poem.poet_id || null);
            setEditedChandaId(poem.chhanda_id || null);
            // Assuming metadata is stored as JSON
            setEditedMetadata(poem.metadata_json ? JSON.stringify(poem.metadata_json, null, 2) : "");
            setEditedSearchSlug(poem.search_slug || "");

            // Set poet name from poet object if available
            if (poem.poet) {
                setEditedPoetName(poem.poet.name || "");
            } else if (poets && poem.poet_id) {
                const foundPoet = poets.find((p: any) => p.id == poem.poet_id);
                if (foundPoet) {
                    setEditedPoetName(foundPoet.name || "");
                }
            }

            // Set Chhanda Name if ID exists and list is loaded
            if (poem.chhanda_id && chhandas) {
                const foundChhanda = chhandas.find((c: any) => c.id == poem.chhanda_id);
                if (foundChhanda) {
                    setEditedChandaName(foundChhanda.name || "");
                } else {
                    setEditedChandaName(String(poem.chhanda_id)); // Fallback
                }
            } else if (poem.chhanda_name) {
                setEditedChandaName(poem.chhanda_name);
            }

            console.log("Edit state initialized.");
        }
    }, [poem, poets, chhandas]); // Depend on chhandas too to resolve name later logic


    // Poet search handler
    // Poet search handler
    // We can now use client-side filtering if 'poets' is available
    const handlePoetSearch = (query: string) => {
        setEditedPoetName(query);
        setEditedPoetId(null); // Clear ID when typing new name

        // If query is empty, show all (or top 20) poets from the fetched list
        // If query has text, filter the fetched list client-side
        if (poets) {
            const filtered = poets.filter((p: any) =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                (p.name_roman && p.name_roman.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 20); // Limit to 20 results
            setPoetSuggestions(filtered);
        }
    };

    // Initialize suggestions when poets load or on focus
    const refreshPoetSuggestions = () => {
        if (poets) {
            // If field is empty, show default list. If has text, filter.
            const query = editedPoetName;
            const filtered = poets.filter((p: any) =>
                !query ||
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                (p.name_roman && p.name_roman.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 20);
            setPoetSuggestions(filtered);
        }
    };

    // Mutation: Save edited content
    const saveMutation = useMutation({
        mutationFn: (data: {
            title: string;
            title_roman?: string;
            body_marathi: string;
            body_roman?: string;
            genre?: string;
            description?: string;
            poet_name?: string;
            poet_id?: number | null;
            chhanda_id?: number | null;
            chhanda_name?: string;
            metadata_json?: any;
            search_slug?: string;
        }) => {
            console.log('Saving poem with data:', data);
            return api.patch(`/api/admin/poems/${id}`, data);
        },
        onSuccess: (data) => {
            console.log('Save successful:', data);
            queryClient.invalidateQueries({ queryKey: ["poem", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] });
            queryClient.invalidateQueries({ queryKey: ["poets"] }); // Refresh poets list in case new poet was created
            setIsEditing(false);
        },
        onError: (error: any) => {
            console.error('Save failed:', error);
            alert(`Failed to save: ${error.message}`);
        },
    });

    // Mutation: Tokenize Poem (creates words from poem body)
    const tokenizeMutation = useMutation({
        mutationFn: () => api.post(`/api/admin/poems/${id}/tokenize`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["poem", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] });
            // Navigate to word enrichment page
            router.push(`/admin/poems/${id}/words`);
        },
        onError: (error: any) => {
            console.error('Tokenization failed:', error);
            alert(`Failed to tokenize: ${error.message}`);
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-maroon animate-spin" />
            </div>
        );
    }

    if (error || !poem) {
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

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-english font-bold text-foreground/40 hover:text-maroon mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Queue
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest border border-gold/20">
                                    {poem.genre || "Uncategorized"}
                                </span>
                                <span className="text-xs font-english text-foreground/40">ID: {id}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                                {language === "devanagari" ? (poem.title || poem.title_roman) : (poem.title_roman || poem.title)}
                            </h1>
                            <div className="flex items-center gap-2 mt-2 text-foreground/60 font-english">
                                <User className="w-4 h-4" />
                                <span>{language === "devanagari" ? (poet?.name || "Unknown") : (poet?.name_roman || poet?.name || "Unknown")}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedTitle(poem.title || "");
                                            setEditedTitleRoman(poem.title_roman || "");
                                            setEditedMarathi(poem.body_marathi || "");
                                            setEditedRoman(poem.body_roman || "");
                                            setEditedGenre(poem.genre || "");
                                            setEditedDescription(poem.description || "");
                                            setEditedPoetName(poem.poet?.name || "");
                                            setEditedPoetId(poem.poet_id || null);
                                            setEditedChandaId(poem.chhanda_id || null);
                                            setEditedChandaName(poem.chhanda_name || (poem.chhanda_id && chhandas?.find((c: any) => c.id == poem.chhanda_id)?.name) || String(poem.chhanda_id || ""));
                                            setEditedMetadata(poem.metadata_json ? JSON.stringify(poem.metadata_json, null, 2) : "");
                                            setEditedSearchSlug(poem.search_slug || "");
                                            setPoetSuggestions([]); // Clear suggestions
                                            setChhandaSuggestions([]);
                                        }}
                                        className="px-6 py-3 rounded-xl border border-foreground/20 text-foreground/60 font-english font-bold text-sm uppercase tracking-widest hover:bg-foreground/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Parse metadata JSON if it's valid
                                            let metadataJson = null;
                                            if (editedMetadata.trim()) {
                                                try {
                                                    metadataJson = JSON.parse(editedMetadata);
                                                } catch (e) {
                                                    alert("Invalid metadata JSON format");
                                                    return;
                                                }
                                            }

                                            saveMutation.mutate({
                                                title: editedTitle,
                                                title_roman: editedTitleRoman,
                                                body_marathi: editedMarathi,
                                                body_roman: editedRoman,
                                                genre: editedGenre,
                                                description: editedDescription,
                                                poet_name: editedPoetName,
                                                poet_id: editedPoetId,
                                                chhanda_id: editedChandaId,
                                                chhanda_name: editedChandaName,
                                                metadata_json: metadataJson,
                                                search_slug: editedSearchSlug,
                                            });
                                        }}
                                        disabled={saveMutation.isPending}
                                        className="px-6 py-3 rounded-xl bg-gold text-white font-english font-bold text-sm uppercase tracking-widest shadow-lg shadow-gold/20 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            console.log("Edit button clicked. Current state values:", {
                                                editedTitle,
                                                editedTitleRoman,
                                                editedMarathi: editedMarathi.substring(0, 50) + "...",
                                                editedRoman: editedRoman.substring(0, 50) + "...",
                                                editedGenre,
                                                editedDescription,
                                                editedChandaId,
                                                editedSearchSlug
                                            });
                                            setIsEditing(true);
                                        }}
                                        className="px-6 py-3 rounded-xl border border-gold/20 text-gold font-english font-bold text-sm uppercase tracking-widest hover:bg-gold/5 transition-all flex items-center gap-2"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Content
                                    </button>

                                    <button
                                        onClick={() => tokenizeMutation.mutate()}
                                        disabled={tokenizeMutation.isPending}
                                        className="px-6 py-3 rounded-xl bg-maroon text-white font-english font-bold text-sm uppercase tracking-widest shadow-lg shadow-maroon/20 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        {tokenizeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Tokenize
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata Display (View Mode) */}
                {!isEditing && (
                    <div className="mb-8 bg-white rounded-3xl border border-gold/10 shadow-sm p-8">
                        <h2 className="text-xl font-serif font-bold text-foreground mb-6 pb-4 border-b border-gold/10">
                            Poem Metadata
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                    Title (Marathi)
                                </label>
                                <p className="text-foreground/80 font-marathi text-lg">
                                    {poem.title || "—"}
                                </p>
                            </div>

                            {/* Title Roman */}
                            <div>
                                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                    Title (Roman)
                                </label>
                                <p className="text-foreground/80 font-english text-lg">
                                    {poem.title_roman || "—"}
                                </p>
                            </div>

                            {/* Genre */}
                            <div>
                                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                    Genre
                                </label>
                                <p className="text-foreground/80 font-english text-lg">
                                    {poem.genre || "—"}
                                </p>
                            </div>

                            {/* Poet Name */}
                            <div>
                                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                    Poet Name
                                </label>
                                <p className="text-foreground/80 font-marathi text-lg">
                                    {poet?.name || "—"}
                                    {poet?.name_roman && (
                                        <span className="text-sm text-foreground/40 font-english ml-2">({poet.name_roman})</span>
                                    )}
                                </p>
                            </div>

                            {/* Chanda ID */}
                            <div>
                                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                    Chhanda
                                </label>
                                <p className="text-foreground/80 font-english text-lg">
                                    {chhandas?.find((c: any) => c.id === poem.chhanda_id)?.name
                                        ? `${chhandas.find((c: any) => c.id === poem.chhanda_id)?.name} (${poem.chhanda_id})`
                                        : (poem.chhanda_id || "—")}
                                </p>
                            </div>

                            {/* Search Slug */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                    Search Slug
                                </label>
                                <p className="text-foreground/80 font-english text-lg">
                                    {poem.search_slug || "—"}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                    Description
                                </label>
                                <p className="text-foreground/80 font-english text-base">
                                    {poem.description || "—"}
                                </p>
                            </div>

                            {/* Metadata JSON */}
                            {poem.metadata_json && (
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">
                                        Metadata (JSON)
                                    </label>
                                    <pre className="text-foreground/60 font-mono text-sm bg-gray-50 p-4 rounded-xl border border-gold/10 overflow-x-auto">
                                        {JSON.stringify(poem.metadata_json, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Auto-Sync Toggle */}
                {isEditing && (
                    <div className="mb-6 flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-gold/10 shadow-sm">
                        <button
                            onClick={() => setAutoSync(!autoSync)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-english font-bold text-sm uppercase tracking-widest transition-all ${autoSync
                                ? "bg-gold text-white shadow-lg shadow-gold/20"
                                : "bg-gray-100 text-foreground/40 hover:bg-gray-200"
                                }`}
                        >
                            {autoSync ? <Link2 className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                            {autoSync ? "Auto-Sync ON" : "Auto-Sync OFF"}
                        </button>
                        <span className="text-xs text-foreground/60 font-english italic">
                            {autoSync ? "Changes sync between scripts" : "Edit scripts independently"}
                        </span>
                    </div>
                )}

                {/* Metadata Edit Section */}
                {isEditing && (
                    <div className="mb-8 bg-white rounded-3xl border border-gold/10 shadow-sm p-8">
                        <h2 className="text-xl font-serif font-bold text-foreground mb-6 pb-4 border-b border-gold/10">
                            Poem Metadata
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Title (Marathi)
                                </label>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-marathi text-lg"
                                    placeholder="शीर्षक"
                                />
                            </div>

                            {/* Title Roman */}
                            <div>
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Title (Roman)
                                </label>
                                <input
                                    type="text"
                                    value={editedTitleRoman}
                                    onChange={(e) => setEditedTitleRoman(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-english text-lg"
                                    placeholder="Title"
                                />
                            </div>

                            {/* Genre */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Genre
                                </label>
                                <input
                                    type="text"
                                    value={editedGenre}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setEditedGenre(val);
                                        // Filter fetched genres. Assuming 'genres' is a list of strings or objects {name: string}
                                        if (genres && genres.length > 0) {
                                            // Handle both string[] and object[] cases safely
                                            const filtered = genres.filter((g: any) => {
                                                const name = typeof g === 'string' ? g : g.name || "";
                                                return name.toLowerCase().includes(val.toLowerCase());
                                            }).map((g: any) => typeof g === 'string' ? g : g.name);
                                            setGenreSuggestions(filtered);
                                        }
                                        setIsSearchingGenre(true);
                                    }}
                                    onFocus={() => {
                                        const val = editedGenre;
                                        if (genres && genres.length > 0) {
                                            const filtered = genres.filter((g: any) => {
                                                const name = typeof g === 'string' ? g : g.name || "";
                                                return name.toLowerCase().includes(val.toLowerCase());
                                            }).map((g: any) => typeof g === 'string' ? g : g.name);
                                            setGenreSuggestions(filtered);
                                        }
                                        setIsSearchingGenre(true);
                                    }}
                                    // Delay hiding to allow click event on suggestions
                                    onBlur={() => setTimeout(() => setIsSearchingGenre(false), 200)}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-english text-lg"
                                    placeholder="e.g. Abhang, Ovi, Lavani"
                                />
                                {isSearchingGenre && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gold/20 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                                        {genreSuggestions.length > 0 ? genreSuggestions.map((genre) => (
                                            <button
                                                key={genre}
                                                type="button"
                                                onClick={() => {
                                                    setEditedGenre(genre);
                                                    setIsSearchingGenre(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gold/5 flex items-center justify-between border-b border-gold/5 last:border-0 transition-colors"
                                            >
                                                <span className="font-english font-medium">{genre}</span>
                                                <Plus className="w-4 h-4 text-maroon" />
                                            </button>
                                        )) : (
                                            <div className="px-4 py-3 text-sm text-foreground/40 italic">
                                                Type to add "{editedGenre}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Poet Name */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Poet Name
                                </label>
                                <input
                                    type="text"
                                    value={editedPoetName}
                                    onChange={(e) => {
                                        setEditedPoetName(e.target.value);
                                        // Trigger search logic locally
                                        if (poets) {
                                            const query = e.target.value.toLowerCase();
                                            const filtered = poets.filter((p: any) =>
                                                p.name.toLowerCase().includes(query) ||
                                                (p.name_roman && p.name_roman.toLowerCase().includes(query))
                                            ).slice(0, 20);
                                            setPoetSuggestions(filtered);
                                        }
                                        setIsSearchingPoets(true); // Re-using state to show dropdown
                                    }}
                                    onFocus={() => {
                                        refreshPoetSuggestions();
                                        setIsSearchingPoets(true);
                                    }}
                                    onBlur={() => setTimeout(() => setIsSearchingPoets(false), 200)}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-marathi text-lg"
                                    placeholder="e.g. तुकाराम"
                                />
                                {isSearchingPoets && poetSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gold/20 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                                        {poetSuggestions.map((poet: any) => (
                                            <button
                                                key={poet.id}
                                                type="button"
                                                onClick={() => {
                                                    setEditedPoetName(poet.name);
                                                    setEditedPoetId(poet.id);
                                                    setIsSearchingPoets(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gold/5 flex items-center justify-between border-b border-gold/5 last:border-0 transition-colors"
                                            >
                                                <div>
                                                    <span className="font-marathi font-bold text-lg">{poet.name}</span>
                                                    {poet.name_roman && (
                                                        <span className="text-xs text-foreground/40 font-english ml-2">({poet.name_roman})</span>
                                                    )}
                                                </div>
                                                <Plus className="w-4 h-4 text-maroon" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Chanda ID / Name */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Chhanda
                                </label>
                                <input
                                    type="text"
                                    value={editedChandaName}
                                    onChange={(e) => {
                                        const query = e.target.value;
                                        setEditedChandaName(query);
                                        setEditedChandaId(null); // Clear ID when modifying name

                                        if (chhandas && chhandas.length > 0) {
                                            const filtered = chhandas.filter((c: any) =>
                                                c.name.toLowerCase().includes(query.toLowerCase())
                                            );
                                            setChhandaSuggestions(filtered);
                                        }
                                        setIsSearchingChhanda(true);
                                    }}
                                    onFocus={() => {
                                        if (chhandas && chhandas.length > 0) {
                                            setChhandaSuggestions(chhandas);
                                        }
                                        setIsSearchingChhanda(true);
                                    }}
                                    onBlur={() => setTimeout(() => setIsSearchingChhanda(false), 200)}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-marathi text-lg"
                                    placeholder="Select or type Chhanda"
                                />
                                {isSearchingChhanda && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gold/20 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                                        {chhandaSuggestions.length > 0 ? chhandaSuggestions.map((ch: any, index: number) => {
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        setEditedChandaName(ch.name);
                                                        setEditedChandaId(ch.id);
                                                        setIsSearchingChhanda(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-gold/5 flex items-center justify-between border-b border-gold/5 last:border-0 transition-colors"
                                                >
                                                    <div>
                                                        <span className="font-marathi font-bold text-lg">{ch.name}</span>
                                                        {ch.name_roman && <span className="text-xs text-foreground/40 font-english ml-2">({ch.name_roman})</span>}
                                                    </div>
                                                    <Plus className="w-4 h-4 text-maroon" />
                                                </button>
                                            )
                                        }) : (
                                            <div className="px-4 py-3 text-sm text-foreground/40 italic">
                                                Type to create "{editedChandaName}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Search Slug */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Search Slug
                                </label>
                                <input
                                    type="text"
                                    value={editedSearchSlug}
                                    onChange={(e) => setEditedSearchSlug(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-english text-lg"
                                    placeholder="search-friendly-slug"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-english text-base resize-none"
                                    placeholder="Brief description of the poem..."
                                />
                            </div>

                            {/* Metadata JSON */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gold uppercase tracking-widest mb-2">
                                    Metadata (JSON)
                                </label>
                                <textarea
                                    value={editedMetadata}
                                    onChange={(e) => setEditedMetadata(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-white border border-gold/20 rounded-xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-mono text-sm resize-none"
                                    placeholder='{"key": "value"}'
                                />
                                <p className="mt-1 text-xs text-foreground/40 font-english italic">
                                    Must be valid JSON format
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Split View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Devanagari Column */}
                    <div className="bg-white rounded-3xl border border-gold/10 shadow-sm p-8 flex flex-col">
                        <div className="pb-4 mb-6 border-b border-gold/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-gold uppercase tracking-widest">Devanagari (Original)</span>
                            <span className="text-xs text-foreground/40 font-marathi">मराठी</span>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editedMarathi}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    setEditedMarathi(newValue);
                                    if (autoSync) {
                                        // Transliterate Devanagari to IAST
                                        const transliterated = Sanscript.t(newValue, "devanagari", "iast");
                                        setEditedRoman(transliterated);
                                    }
                                }}
                                className="w-full min-h-[500px] px-6 py-6 bg-white border border-gold/20 rounded-2xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-marathi text-xl leading-loose resize-none"
                                placeholder="Enter Devanagari content..."
                            />
                        ) : (
                            <div className="prose prose-lg max-w-none font-marathi leading-loose text-foreground/80 whitespace-pre-wrap">
                                {poem.body_marathi || "No Marathi content available."}
                            </div>
                        )}
                    </div>

                    {/* Roman/Translation Column */}
                    <div className="bg-white rounded-3xl border border-gold/10 shadow-sm p-8 flex flex-col bg-slate-50/50">
                        <div className="pb-4 mb-6 border-b border-gold/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-gold uppercase tracking-widest">Roman Transliteration</span>
                            <span className="text-xs text-foreground/40 font-english">English</span>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editedRoman}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    setEditedRoman(newValue);
                                    if (autoSync) {
                                        // Transliterate IAST to Devanagari
                                        const transliterated = Sanscript.t(newValue, "iast", "devanagari");
                                        setEditedMarathi(transliterated);
                                    }
                                }}
                                className="w-full min-h-[500px] px-6 py-6 bg-white border border-gold/20 rounded-2xl focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all font-english text-xl leading-loose resize-none"
                                placeholder="Enter Roman transliteration..."
                            />
                        ) : (
                            <div className="prose prose-lg max-w-none font-english leading-loose text-foreground/80 whitespace-pre-wrap">
                                {poem.body_roman || "Roman transliteration not available for this poem."}
                            </div>
                        )}
                    </div>
                </div>

            </section>
            <Footer />
        </main>
    );
}
