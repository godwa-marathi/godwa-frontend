import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-white border-t border-gold/20 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex flex-col mb-6">
                            <span className="text-3xl font-serif font-bold text-maroon tracking-tight">
                                Godwa
                            </span>
                            <span className="text-xs font-marathi text-gold font-medium tracking-[0.3em] uppercase mt-0.5">
                                गोडवा
                            </span>
                        </Link>
                        <p className="text-foreground/60 font-english leading-relaxed max-w-sm">
                            {t.footer_brand_desc}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-6">{t.footer_nav_title}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/explore" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_explore}</Link></li>
                            <li><Link href="/poets" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_poets}</Link></li>
                            <li><Link href="/collections" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_collections}</Link></li>
                            <li><Link href="/submit" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_submit}</Link></li>
                        </ul>
                    </div>

                    {/* Legal/Contact */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-6">{t.footer_foundation_title}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about-us" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_about}</Link></li>
                            <li><Link href="/contact" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_contact}</Link></li>
                            <li><Link href="/privacy-policy" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_privacy}</Link></li>
                            <li><Link href="/terms-of-service" className="text-sm font-english text-foreground/60 hover:text-maroon transition-colors">{t.footer_links_terms}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-foreground/40 font-english">
                        © {new Date().getFullYear()} {t.footer_rights}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-foreground/40 font-english">
                        {t.footer_made_with} <Heart className="w-3 h-3 text-maroon fill-maroon" /> for Marathi literature.
                    </div>
                </div>
            </div>
        </footer>
    );
};
