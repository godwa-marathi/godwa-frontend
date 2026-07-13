import { ImageResponse } from 'next/og';
import { PoemOut } from '@/lib/types';

// Ensure the Serverless function has enough time to run
export const maxDuration = 20;

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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const paramsResolved = await params;
        const id = paramsResolved.id;

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

        // Build the correct URL dynamically based on the current host, defaulting to production URL for logo to avoid local dev server deadlock
        const absoluteLogoUrl = 'https://godwa.space/godwa-logo.png';

        // Fetch font data
        const fontRozha = await fetch('https://fonts.gstatic.com/s/rozhaone/v17/AlZy_zVFtYP12Zncg2khdQ.ttf').then(res => {
            if (!res.ok) throw new Error('Failed to load Rozha One font');
            return res.arrayBuffer();
        });
        const fontPoppins = await fetch('https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrFJA.ttf').then(res => {
            if (!res.ok) throw new Error('Failed to load Poppins font');
            return res.arrayBuffer();
        });

        return new ImageResponse(
            (
                <div style={{
                    width: '1200px',
                    height: '630px',
                    backgroundColor: '#faf9f6',
                    padding: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        border: '3px solid #84232C',
                        padding: '12px',
                        display: 'flex',
                        boxSizing: 'border-box',
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            border: '1px solid #84232C',
                            padding: '48px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            boxSizing: 'border-box',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                <span style={{
                                    fontSize: '100px',
                                    lineHeight: '1',
                                    color: '#111827',
                                    fontWeight: 'bold',
                                    maxWidth: '65%',
                                    fontFamily: '"Rozha One", serif',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>{title}</span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <img src={absoluteLogoUrl} alt="Godwa Logo" style={{ height: '112px', width: 'auto', marginBottom: '8px', objectFit: 'contain' }} />
                                    <span style={{ fontSize: '24px', color: '#c5a059', marginTop: '8px', fontFamily: 'Poppins, sans-serif', letterSpacing: '0.05em' }}>Marathi Literature</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    {poetImageUrl && (
                                        <div style={{
                                            width: '128px',
                                            height: '128px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: '3px solid #84232C',
                                            backgroundColor: '#ffffff',
                                            display: 'flex',
                                        }}>
                                            <img src={poetImageUrl} alt={poet} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '24px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>Written By</span>
                                        <span style={{ fontSize: '50px', color: '#84232C', fontWeight: 'bold', fontFamily: '"Rozha One", serif' }}>{poet}</span>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    maxWidth: '50%',
                                    borderRight: '4px solid #c5a059',
                                    paddingRight: '24px',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    boxSizing: 'border-box',
                                }}>
                                    <span style={{
                                        fontSize: '28px',
                                        color: '#374151',
                                        textAlign: 'right',
                                        fontFamily: '"Rozha One", serif',
                                        lineHeight: '1.6',
                                        fontStyle: 'italic',
                                        whiteSpace: 'pre-wrap',
                                    }}>
                                        "{snippet}"
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Rozha One',
                        data: fontRozha,
                        style: 'normal',
                    },
                    {
                        name: 'Poppins',
                        data: fontPoppins,
                        style: 'normal',
                    }
                ]
            }
        );
    } catch (error) {
        console.error('OG Image generation error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
