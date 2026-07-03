"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserAvatar } from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Edit3, Check, X, FileText, Heart, Calendar,
    Award, ChevronRight, Trash2, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserSubmission, LikedPoemSummary, PresetAvatar } from "@/lib/types";

// Preset avatar emoji map
const PRESET_EMOJI: Record<string, string> = {
    lotus: "🪷", quill: "🪶", book: "📖", lamp: "🪔",
    peacock: "🦚", moon: "🌙", star: "⭐", ink: "🖋️",
};

const STATUS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    tokenized: { label: "In Review", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
    approved: { label: "Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
    draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
};

export default function ProfilePage() {
    const { user, token, isLoading, refreshUser } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<"submissions" | "likes">(
        (searchParams.get("tab") as "submissions" | "likes") || "submissions"
    );
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        display_name: "",
        username: "",
        bio: "",
        avatar_type: "google" as "google" | "preset",
        avatar_preset: "",
    });
    const [editError, setEditError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
    const [likedPoems, setLikedPoems] = useState<LikedPoemSummary[]>([]);
    const [presetAvatars, setPresetAvatars] = useState<PresetAvatar[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !token) {
            router.push("/auth/login");
        }
    }, [isLoading, token, router]);

    // Sync tab with URL params
    useEffect(() => {
        const tab = searchParams.get("tab") as "submissions" | "likes";
        if (tab === "submissions" || tab === "likes") {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Initialize edit form when user loads
    useEffect(() => {
        if (user) {
            setEditForm({
                display_name: user.display_name || user.name || "",
                username: user.username || "",
                bio: user.bio || "",
                avatar_type: user.avatar_type || "google",
                avatar_preset: user.avatar_preset || "",
            });
        }
    }, [user]);

    // Fetch data
    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [subsRes, likesRes, avatarsRes] = await Promise.all([
                    api.get<UserSubmission[]>("/api/users/me/submissions"),
                    api.get<LikedPoemSummary[]>("/api/users/me/liked"),
                    api.get<PresetAvatar[]>("/api/users/avatars"),
                ]);
                setSubmissions(subsRes);
                setLikedPoems(likesRes);
                setPresetAvatars(avatarsRes);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            }
            setLoadingData(false);
        };

        fetchData();
    }, [token]);

    const handleSave = async () => {
        setIsSaving(true);
        setEditError("");

        try {
            // Only send changed fields
            const payload: Record<string, any> = {};
            if (editForm.display_name !== (user?.display_name || user?.name || "")) {
                payload.display_name = editForm.display_name;
            }
            if (editForm.username !== (user?.username || "")) {
                payload.username = editForm.username || null;
            }
            if (editForm.bio !== (user?.bio || "")) {
                payload.bio = editForm.bio || null;
            }
            if (editForm.avatar_type !== (user?.avatar_type || "google")) {
                payload.avatar_type = editForm.avatar_type;
            }
            if (editForm.avatar_preset !== (user?.avatar_preset || "")) {
                payload.avatar_preset = editForm.avatar_preset || null;
            }

            if (Object.keys(payload).length > 0) {
                await api.patch("/api/users/me", payload);
                await refreshUser();
            }
            setIsEditing(false);
        } catch (err: any) {
            setEditError(err.message || "Failed to save changes");
        }
        setIsSaving(false);
    };

    const handleDeleteAccount = async () => {
        try {
            await api.get("/api/users/me"); // Verify still authenticated
            // Use fetch directly for DELETE
            const Cookies = (await import("js-cookie")).default;
            const tokenVal = Cookies.get("godwa_access_token");
            const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://iampratham29-godwa-backend.hf.space";
            await fetch(`${BASE_URL}/api/users/me`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${tokenVal}` },
            });
            Cookies.remove("godwa_access_token");
            window.location.href = "/";
        } catch (err) {
            console.error("Failed to delete account:", err);
        }
    };

    if (isLoading || !user) {
        return (
            <main className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-foreground/40 font-english">Loading profile...</div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-gold/10 shadow-lg shadow-gold/5 overflow-hidden"
                >
                    {/* Banner gradient */}
                    <div className="h-24 md:h-32 bg-gradient-to-r from-maroon/80 via-maroon/60 to-gold/40" />

                    <div className="px-6 md:px-8 pb-6 -mt-12 md:-mt-14">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full ring-4 ring-white bg-white overflow-hidden">
                                    <UserAvatar user={isEditing ? { ...user, ...editForm } : user} size={112} />
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            setEditForm((f) => ({
                                                ...f,
                                                avatar_type: f.avatar_type === "google" ? "preset" : "google",
                                            }));
                                        }}
                                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gold/20 shadow-md flex items-center justify-center hover:bg-gold/5 transition-colors"
                                    >
                                        <Edit3 className="w-3.5 h-3.5 text-maroon" />
                                    </button>
                                )}
                            </div>

                            {/* Name & info */}
                            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editForm.display_name}
                                            onChange={(e) => setEditForm((f) => ({ ...f, display_name: e.target.value }))}
                                            className="text-xl font-bold text-foreground bg-transparent border-b-2 border-maroon/30 focus:border-maroon outline-none w-full font-english"
                                            placeholder="Display name"
                                        />
                                        <div className="flex items-center gap-1">
                                            <span className="text-foreground/40 text-sm">@</span>
                                            <input
                                                type="text"
                                                value={editForm.username}
                                                onChange={(e) =>
                                                    setEditForm((f) => ({
                                                        ...f,
                                                        username: e.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                                                    }))
                                                }
                                                className="text-sm text-foreground/60 bg-transparent border-b border-gold/20 focus:border-maroon outline-none font-english"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                                            {user.display_name || user.name}
                                        </h1>
                                        {user.username && (
                                            <p className="text-sm text-foreground/40 font-english">@{user.username}</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Edit / Save buttons */}
                            <div className="flex gap-2 shrink-0">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-white text-sm font-english font-bold hover:bg-maroon/90 transition-colors disabled:opacity-50"
                                        >
                                            <Check className="w-4 h-4" />
                                            {isSaving ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditError("");
                                                setEditForm({
                                                    display_name: user.display_name || user.name || "",
                                                    username: user.username || "",
                                                    bio: user.bio || "",
                                                    avatar_type: user.avatar_type || "google",
                                                    avatar_preset: user.avatar_preset || "",
                                                });
                                            }}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold/20 text-foreground/60 text-sm font-english hover:bg-gold/5 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold/20 text-foreground/60 text-sm font-english hover:bg-gold/5 hover:text-maroon transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mt-4">
                            {isEditing ? (
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                                    className="w-full text-sm text-foreground/60 bg-transparent border border-gold/20 rounded-xl p-3 focus:border-maroon outline-none resize-none font-english"
                                    placeholder="Write a short bio..."
                                    rows={2}
                                    maxLength={500}
                                />
                            ) : (
                                user.bio && (
                                    <p className="text-sm text-foreground/60 font-english">{user.bio}</p>
                                )
                            )}
                        </div>

                        {/* Avatar preset picker (visible in edit mode) */}
                        {isEditing && editForm.avatar_type === "preset" && (
                            <div className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
                                <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3 font-english">
                                    Choose Avatar
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {presetAvatars.map((avatar) => (
                                        <button
                                            key={avatar.id}
                                            onClick={() =>
                                                setEditForm((f) => ({ ...f, avatar_preset: avatar.id }))
                                            }
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all ${
                                                editForm.avatar_preset === avatar.id
                                                    ? "border-maroon bg-maroon/10 scale-110"
                                                    : "border-gold/20 hover:border-maroon/30 bg-white"
                                            }`}
                                            title={avatar.label}
                                        >
                                            {avatar.emoji}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() =>
                                            setEditForm((f) => ({ ...f, avatar_type: "google" }))
                                        }
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gold/20 hover:border-maroon/30 bg-white text-foreground/40 transition-all font-english"
                                        title="Use Google Photo"
                                    >
                                        📷
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {editError && (
                            <p className="mt-3 text-sm text-red-500 font-english">{editError}</p>
                        )}

                        {/* Stats row */}
                        <div className="mt-6 flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-foreground/50">
                                <Calendar className="w-4 h-4" />
                                <span className="font-english">
                                    Member since{" "}
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString("en-US", {
                                              month: "short",
                                              year: "numeric",
                                          })
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/50">
                                <FileText className="w-4 h-4" />
                                <span className="font-english">
                                    {user.submission_count} submitted
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/50">
                                <Award className="w-4 h-4" />
                                <span className="font-english">
                                    {user.approved_count} approved
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="mt-8 flex gap-1 bg-white rounded-2xl border border-gold/10 p-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab("submissions")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-english font-bold transition-all ${
                            activeTab === "submissions"
                                ? "bg-maroon text-white shadow-md"
                                : "text-foreground/50 hover:text-maroon hover:bg-gold/5"
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        {t.nav_my_submissions}
                        {submissions.length > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                activeTab === "submissions" ? "bg-white/20" : "bg-gold/10"
                            }`}>
                                {submissions.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("likes")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-english font-bold transition-all ${
                            activeTab === "likes"
                                ? "bg-maroon text-white shadow-md"
                                : "text-foreground/50 hover:text-maroon hover:bg-gold/5"
                        }`}
                    >
                        <Heart className="w-4 h-4" />
                        {t.nav_my_likes}
                        {likedPoems.length > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                activeTab === "likes" ? "bg-white/20" : "bg-gold/10"
                            }`}>
                                {likedPoems.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                >
                    {loadingData ? (
                        <div className="text-center py-16">
                            <div className="animate-pulse text-foreground/30 font-english">Loading...</div>
                        </div>
                    ) : activeTab === "submissions" ? (
                        <div className="space-y-3">
                            {submissions.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gold/10">
                                    <FileText className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
                                    <p className="text-foreground/40 font-english mb-4">
                                        You haven&apos;t submitted any poems yet.
                                    </p>
                                    <Link
                                        href="/submit"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-maroon text-white rounded-xl font-english font-bold text-sm hover:bg-maroon/90 transition-colors"
                                    >
                                        Submit a Poem
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                submissions.map((sub) => {
                                    const badge = STATUS_BADGES[sub.status] || STATUS_BADGES.draft;
                                    return (
                                        <Link
                                            key={sub.id}
                                            href={sub.url_slug ? `/poem/${sub.url_slug}` : "#"}
                                            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gold/10 hover:border-maroon/20 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-foreground group-hover:text-maroon transition-colors truncate font-marathi">
                                                    {sub.title}
                                                </h3>
                                                {sub.poet_name && (
                                                    <p className="text-xs text-foreground/40 mt-0.5 font-marathi">
                                                        {sub.poet_name}
                                                    </p>
                                                )}
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.color}`}
                                            >
                                                {badge.label}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-maroon transition-colors shrink-0" />
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {likedPoems.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gold/10">
                                    <Heart className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
                                    <p className="text-foreground/40 font-english mb-4">
                                        You haven&apos;t liked any poems yet.
                                    </p>
                                    <Link
                                        href="/explore"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-maroon text-white rounded-xl font-english font-bold text-sm hover:bg-maroon/90 transition-colors"
                                    >
                                        Explore Poems
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                likedPoems.map((poem) => (
                                    <Link
                                        key={poem.id}
                                        href={poem.url_slug ? `/poem/${poem.url_slug}` : "#"}
                                        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gold/10 hover:border-maroon/20 hover:shadow-md transition-all group"
                                    >
                                        <Heart className="w-5 h-5 text-red-400 fill-red-400 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-foreground group-hover:text-maroon transition-colors truncate font-marathi">
                                                {poem.title}
                                            </h3>
                                            {poem.poet_name && (
                                                <p className="text-xs text-foreground/40 mt-0.5 font-marathi">
                                                    {poem.poet_name}
                                                </p>
                                            )}
                                        </div>
                                        {poem.liked_at && (
                                            <span className="text-xs text-foreground/30 font-english shrink-0">
                                                {new Date(poem.liked_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-maroon transition-colors shrink-0" />
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Danger Zone */}
                <div className="mt-12 p-6 bg-white rounded-2xl border border-red-100">
                    <h3 className="text-sm font-bold text-red-500/80 uppercase tracking-wider font-english mb-3">
                        Danger Zone
                    </h3>
                    {showDeleteConfirm ? (
                        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-red-700 font-english font-bold">
                                    Are you sure? This cannot be undone.
                                </p>
                                <p className="text-xs text-red-500/70 mt-1 font-english">
                                    Your likes will be removed. Poems you submitted will remain but without attribution.
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold font-english hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-english hover:bg-red-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 font-english transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
