import React from 'react';
import { PoemOut } from '@/lib/types';

const RAW_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://iampratham29-godwa-backend.hf.space';
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;

async function getPoem(id: string): Promise<PoemOut | null> {
    try {
        const endpoint = isNaN(Number(id)) ? `/api/poems/slug/${id}` : `/api/poems/${id}`;
        const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

export default async function OGTemplatePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParamsResolved = await searchParams;
    const id = searchParamsResolved.id as string;

    // Default Fallbacks
    let title = 'Godwa';
    let poet = 'अज्ञात कवी';
    let snippet = 'गोडवा - मराठी साहित्याचा वारसा';
    let poetImageUrl = null;

    if (id) {
        const poem = await getPoem(id);
        if (poem) {
            title = poem.title || 'Godwa';
            poet = poem.poet?.name || 'अज्ञात कवी';

            if (poem.poet_id) {
                try {
                    const poetRes = await fetch(`${BASE_URL}/api/poets/${poem.poet_id}`, { next: { revalidate: 3600 } });
                    if (poetRes.ok) {
                        const fullPoet = await poetRes.json();
                        poetImageUrl = fullPoet.image_url || null;
                    }
                } catch (e) {
                    console.error("Failed to fetch poet image", e);
                }
            }

            if (poem.body_marathi) {
                // Get the first two lines that are not empty
                const normalizedBody = poem.body_marathi
                    .replace(/\\r\\n/g, "\n")
                    .replace(/\\n/g, "\n")
                    .replace(/\\r/g, "\n")
                    .replace(/\r\n/g, "\n")
                    .replace(/\r/g, "\n");
                const lines = normalizedBody.split('\n').map((l: string) => l.trim()).filter((l: string) => l !== '');
                if (lines.length > 0) {
                    const selectedLines = lines.slice(0, 2);
                    snippet = selectedLines.join('\n') + '...';
                }
            }
        }
    }

    // Design 5: Magazine Editorial
    return (
        <div style={{ width: '1200px', height: '630px', overflow: 'hidden', position: 'relative' }}>
            <div className="flex w-full h-full bg-[#faf9f6] p-12">
                <div className="flex w-full h-full border-[3px] border-[#84232C] p-3">
                    <div className="flex flex-col w-full h-full border border-[#84232C] p-12 justify-between relative">
                        <div className="flex justify-between items-start w-full">
                            <h1 className="text-[7.5rem] leading-none text-gray-900 font-bold max-w-[60%] font-marathi">{title}</h1>
                            <div className="flex flex-col items-end text-right">
                                {/* Next.js public folder image */}
                                <img src="/godwa-logo.png" alt="Godwa Logo" className="h-28 w-auto mb-2 object-contain" />
                                <span className="text-2xl text-[#c5a059] mt-2 font-english tracking-wide">Marathi Literature</span>
                            </div>
                        </div>
                        <div className="flex w-full justify-between items-end">
                            <div className="flex items-center gap-6">
                                {poetImageUrl && (
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-[3px] border-[#84232C] bg-white flex-shrink-0">
                                        <img src={poetImageUrl} alt={poet} className="w-full h-full object-cover" style={{ objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-3xl text-gray-500 uppercase tracking-[0.2em] mb-4 font-english font-medium">Written By</span>
                                    <span className="text-6xl text-[#84232C] font-bold font-marathi">{poet}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end max-w-[50%] border-r-4 border-[#c5a059] pr-6 py-4 bg-gradient-to-l from-[#c5a059]/10 to-transparent overflow-hidden">
                                <span className="text-3xl text-gray-700 text-right font-marathi leading-relaxed font-medium italic whitespace-pre-wrap break-words line-clamp-3">
                                    "{snippet}"
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
