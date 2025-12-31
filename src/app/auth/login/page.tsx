"use client";

import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { LogIn, ShieldCheck, Mail, Globe, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login, token } = useAuth();
    const router = useRouter();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    useEffect(() => {
        const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        const initializeGoogle = () => {
            if (typeof window !== "undefined" && (window as any).google?.accounts?.id && client_id && googleButtonRef.current) {
                (window as any).google.accounts.id.initialize({
                    client_id: client_id,
                    callback: async (response: any) => {
                        try {
                            await login(response.credential);
                            router.push("/");
                        } catch (error) {
                            console.error("Google Login Failed", error);
                        }
                    },
                });
                (window as any).google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: "outline", size: "large", width: "100%" }
                );
                (window as any).google.accounts.id.prompt();
                return true;
            }
            return false;
        };

        if (!initializeGoogle()) {
            const interval = setInterval(() => {
                if (initializeGoogle()) {
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [login, router]);

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-3xl border border-gold/10 shadow-2xl p-8 md:p-12"
                >
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 rounded-full bg-maroon/5 text-maroon mb-6">
                            <LogIn className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome Back</h1>
                        <p className="text-foreground/60 font-english">Sign in to Godwa to contribute, save your favorite poems, and explore deep linguistic insights.</p>
                    </div>

                    <div className="space-y-6">
                        {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-english space-y-2">
                                <div className="font-bold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Environment Setup Required
                                </div>
                                <p className="text-xs opacity-80">
                                    Google Sign-In is disabled because <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> is missing.
                                </p>
                                <div className="text-[10px] mt-2 pt-2 border-t border-amber-200">
                                    Please create a <code className="font-bold">.env.local</code> file in the project root and add your Google Client ID.
                                </div>
                            </div>
                        ) : (
                            <div ref={googleButtonRef} className="w-full flex justify-center min-h-[50px]" />
                        )}

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gold/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest text-gold font-bold">
                                <span className="px-2 bg-white">Secure Access</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
                                <ShieldCheck className="w-5 h-5 text-gold" />
                                <div className="text-left">
                                    <div className="text-xs font-bold text-foreground uppercase tracking-wider">Privacy First</div>
                                    <div className="text-[10px] text-foreground/40 font-english">We only store your email and name.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-xs text-foreground/40 font-english">
                        By signing in, you agree to our <br />
                        <Link href="/terms" className="text-maroon hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-maroon hover:underline">Privacy Policy</Link>
                    </p>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}

// Simple Link placeholder since it's used above
function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
    return <a href={href} className={className}>{children}</a>;
}
