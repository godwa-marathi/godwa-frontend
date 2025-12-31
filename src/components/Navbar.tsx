"use client";

import React from "react";
import Link from "next/link";
import { Search, Menu, User, LogOut, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
    const { token, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
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
                            Explore
                        </Link>
                        <Link href="/poets" className="text-sm font-english font-medium text-foreground/80 hover:text-maroon transition-colors uppercase tracking-widest">
                            Poets
                        </Link>
                        <Link href="/submit" className="text-sm font-english font-medium text-foreground/80 hover:text-maroon transition-colors uppercase tracking-widest">
                            Submit
                        </Link>
                        {token && (
                            <Link href="/admin" className="text-sm font-english font-bold text-gold hover:text-maroon transition-colors uppercase tracking-widest">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-foreground/60 hover:text-maroon transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {token ? (
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-maroon/20 hover:bg-maroon/5 transition-all text-maroon text-sm font-medium font-english"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-maroon/20 hover:border-maroon/40 hover:bg-maroon/5 transition-all text-maroon text-sm font-medium font-english"
                            >
                                <User className="w-4 h-4" />
                                Sign In
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
                            {token && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-lg font-english font-bold text-gold hover:text-maroon py-2 px-4 rounded-xl hover:bg-gold/5 transition-all"
                                >
                                    Admin
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
                                        Sign Out
                                    </button>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-maroon text-white font-english font-bold uppercase tracking-widest text-sm"
                                    >
                                        <User className="w-4 h-4" />
                                        Sign In
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
