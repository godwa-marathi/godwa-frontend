"use client";

import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Search, User, X, FileText, Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

// Preset avatar emoji map
const PRESET_EMOJI: Record<string, string> = {
    lotus: "🪷", quill: "🪶", book: "📖", lamp: "🪔",
    peacock: "🦚", moon: "🌙", star: "⭐", ink: "🖋️",
};

function UserAvatar({ user, size = 32 }: { user: any; size?: number }) {
    if (user?.avatar_type === "preset" && user?.avatar_preset) {
        return (
            <div
                className="rounded-full bg-gradient-to-br from-gold/20 to-maroon/10 flex items-center justify-center border border-gold/20"
                style={{ width: size, height: size }}
            >
                <span style={{ fontSize: size * 0.55 }}>
                    {PRESET_EMOJI[user.avatar_preset] || "👤"}
                </span>
            </div>
        );
    }
    if (user?.avatar) {
        return (
            <Image
                src={user.avatar}
                alt={user.display_name || user.name || "User"}
                width={size}
                height={size}
                className="rounded-full border border-gold/20 object-cover"
                referrerPolicy="no-referrer"
            />
        );
    }
    return (
        <div
            className="rounded-full bg-maroon/10 flex items-center justify-center border border-gold/20"
            style={{ width: size, height: size }}
        >
            <User className="text-maroon" style={{ width: size * 0.55, height: size * 0.55 }} />
        </div>
    );
}

export { UserAvatar };

export const Navbar = () => {
    const { token, user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [isLangOpen, setIsLangOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const langDropdownRef = React.useRef<HTMLDivElement>(null);
    const profileDropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!mounted) return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-gold/10">
            <div className="max-w-7xl mx-auto px-4 h-16 md:h-20" />
        </nav>
    );

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-gold/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex flex-col items-center group">
                        <span className="text-2xl font-serif font-bold text-maroon tracking-tight leading-none">
                            Godwa
                        </span>
                        <span className="text-[10px] font-marathi text-gold font-medium tracking-widest uppercase mt-0.5">
                            गोडवा
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/explore" className="text-sm font-english font-medium text-foreground/80 hover:text-maroon transition-colors uppercase tracking-widest">
                            {t.nav_explore}
                        </Link>
                        <Link href="/poets" className="text-sm font-english font-medium text-foreground/80 hover:text-maroon transition-colors uppercase tracking-widest">
                            {t.nav_poets}
                        </Link>
                        <Link href="/submit" className="text-sm font-english font-medium text-foreground/80 hover:text-maroon transition-colors uppercase tracking-widest">
                            {t.nav_submit}
                        </Link>
                        {user?.is_admin && (
                            <Link href="/admin" className="text-sm font-english font-bold text-gold hover:text-maroon transition-colors uppercase tracking-widest">
                                {t.nav_admin}
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Language Toggle Dropdown */}
                        <div className="relative group/lang" ref={langDropdownRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/20 hover:border-maroon/20 hover:bg-gold/5 transition-all focus:outline-none"
                            >
                                <span className="font-english font-bold text-xs uppercase tracking-widest text-maroon">
                                    {language === "devanagari" ? "MAR" : "ENG"}
                                </span>
                                <span className="text-[10px] text-gold/60 transition-transform duration-200" style={{ transform: isLangOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                            </button>

                            <div className={`absolute right-0 top-full mt-2 w-32 bg-white rounded-xl border border-gold/10 shadow-lg shadow-gold/5 py-1 z-50 transition-all transform origin-top-right md:group-hover/lang:opacity-100 md:group-hover/lang:visible md:group-hover/lang:scale-100 ${isLangOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95 pointer-events-none md:pointer-events-auto'}`}>
                                <button
                                    onClick={() => {
                                        setLanguage("devanagari");
                                        setIsLangOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm font-marathi hover:bg-gold/5 transition-colors flex items-center justify-between ${language === "devanagari" ? "text-maroon font-bold" : "text-foreground/60"}`}
                                >
                                    <span>Devanagari</span>
                                    {language === "devanagari" && <span className="text-maroon text-xs">✓</span>}
                                </button>
                                <button
                                    onClick={() => {
                                        setLanguage("roman");
                                        setIsLangOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm font-english hover:bg-gold/5 transition-colors flex items-center justify-between ${language === "roman" ? "text-maroon font-bold" : "text-foreground/60"}`}
                                >
                                    <span>English</span>
                                    {language === "roman" && <span className="text-maroon text-xs">✓</span>}
                                </button>
                            </div>
                        </div>

                        <button className="p-2 text-foreground/60 hover:text-maroon transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* User Avatar / Auth */}
                        {token && user ? (
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="hidden sm:flex items-center gap-2 rounded-full hover:ring-2 hover:ring-maroon/20 transition-all focus:outline-none"
                                >
                                    <UserAvatar user={user} size={36} />
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gold/10 shadow-xl shadow-gold/10 py-2 z-50"
                                        >
                                            {/* User info header */}
                                            <div className="px-4 py-3 border-b border-gold/10">
                                                <p className="text-sm font-bold text-foreground truncate">
                                                    {user.display_name || user.name}
                                                </p>
                                                <p className="text-xs text-foreground/40 truncate font-english">
                                                    {user.email}
                                                </p>
                                            </div>

                                            {/* Menu items */}
                                            <div className="py-1">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-maroon hover:bg-gold/5 transition-colors font-english"
                                                >
                                                    <User className="w-4 h-4" />
                                                    {t.nav_profile}
                                                </Link>
                                                <Link
                                                    href="/profile?tab=submissions"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-maroon hover:bg-gold/5 transition-colors font-english"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    {t.nav_my_submissions}
                                                </Link>
                                                <Link
                                                    href="/profile?tab=likes"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-maroon hover:bg-gold/5 transition-colors font-english"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    {t.nav_my_likes}
                                                </Link>
                                            </div>

                                            {/* Sign out */}
                                            <div className="border-t border-gold/10 pt-1">
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        logout();
                                                    }}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500/80 hover:text-red-600 hover:bg-red-50/50 transition-colors font-english"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    {t.nav_signout}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-maroon/20 hover:border-maroon/40 hover:bg-maroon/5 transition-all text-maroon text-sm font-medium font-english shrink-0"
                            >
                                <User className="w-4 h-4" />
                                {t.nav_signin}
                            </Link>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 text-foreground/60 hover:text-maroon transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gold/10 bg-white overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {/* Mobile: User info at top when logged in */}
                            {token && user && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold/5 border border-gold/10 mb-2">
                                    <UserAvatar user={user} size={40} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-foreground truncate">
                                            {user.display_name || user.name}
                                        </p>
                                        <p className="text-xs text-foreground/40 truncate font-english">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Link
                                href="/explore"
                                onClick={() => setIsOpen(false)}
                                className="block text-lg font-english font-medium text-foreground/80 hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                            >
                                Explore
                            </Link>
                            <Link
                                href="/poets"
                                onClick={() => setIsOpen(false)}
                                className="block text-lg font-english font-medium text-foreground/80 hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                            >
                                Poets
                            </Link>
                            <Link
                                href="/submit"
                                onClick={() => setIsOpen(false)}
                                className="block text-lg font-english font-medium text-foreground/80 hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                            >
                                Submit
                            </Link>

                            {/* Mobile: Profile links */}
                            {token && user && (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-lg font-english font-medium text-foreground/80 hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                                    >
                                        {t.nav_profile}
                                    </Link>
                                    <Link
                                        href="/profile?tab=submissions"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-lg font-english font-medium text-foreground/80 hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                                    >
                                        {t.nav_my_submissions}
                                    </Link>
                                    <Link
                                        href="/profile?tab=likes"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-lg font-english font-medium text-foreground/80 hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                                    >
                                        {t.nav_my_likes}
                                    </Link>
                                </>
                            )}

                            {user?.is_admin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-lg font-english font-bold text-gold hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                                >
                                    {t.nav_admin}
                                </Link>
                            )}
                            <div className="pt-4 border-t border-gold/10 flex flex-col gap-3">
                                {token ? (
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-maroon text-white font-english font-bold uppercase tracking-widest text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {t.nav_signout}
                                    </button>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-maroon text-white font-english font-bold uppercase tracking-widest text-sm"
                                    >
                                        <User className="w-4 h-4" />
                                        {t.nav_signin}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
