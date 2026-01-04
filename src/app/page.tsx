"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PoemCard, PoetCard } from "@/components/Cards";
import { RekhtaReader } from "@/components/RekhtaReader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PoemOut, PoetOut } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  // Fetch featured poems
  const { data: poems, isLoading: loadingPoems } = useQuery({
    queryKey: ["poems", "featured"],
    queryFn: () => api.get<PoemOut[]>("/api/poems/"),
  });

  // Fetch celebrated poets
  const { data: poets, isLoading: loadingPoets } = useQuery({
    queryKey: ["poets", "celebrated"],
    queryFn: () => api.get<PoetOut[]>("/api/poets/"),
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["home", "stats"],
    queryFn: () => api.get<any>("/api/home"),
  });

  // Use the first approved poem for the demo if available, otherwise fallback
  const demoPoem = poems?.find(p => p.status === "approved" && p.words?.length > 0) || poems?.[0];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <Hero />

      {/* Interactive Demo Section */}
      <section className="py-24 bg-gold/5 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-maroon/5 text-maroon text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            {t.home_interactive_tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t.home_interactive_title}
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/60 font-english">
            {t.home_interactive_desc}
          </p>
        </div>

        {loadingPoems ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-maroon animate-spin" />
          </div>
        ) : demoPoem ? (
          <RekhtaReader poem={demoPoem} />
        ) : (
          <div className="text-center text-foreground/40 font-english py-20">
            No poems available for demo.
          </div>
        )}

        {demoPoem && (
          <div className="text-center mt-12">
            <p className="text-xs text-gold font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              {t.home_interactive_hint}
            </p>
          </div>
        )}
      </section>

      {/* Featured Poems grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">{t.home_featured_title}</h2>
            <p className="text-foreground/60 font-english mt-2">{t.home_featured_subtitle}</p>
          </div>
          <a href="/explore" className="text-maroon font-english font-bold text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
            {t.home_view_all}
          </a>
        </div>

        {loadingPoems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-gold/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {poems?.slice(0, 6).map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        )}
      </section>

      {/* Celebrated Poets */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground">{t.home_poets_title}</h2>
            <p className="text-foreground/60 font-english mt-2">{t.home_poets_subtitle}</p>
          </div>

          {loadingPoets ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-full bg-gold/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {poets?.slice(0, 4).map((poet) => (
                <PoetCard key={poet.id} poet={poet} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
