import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import fs from 'fs';

// Ensure the Serverless function has enough time to launch Chromium
export const maxDuration = 20;

const RAW_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://iampratham29-godwa-backend.hf.space';
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;

async function getPoem(id: string) {
    try {
        const endpoint = isNaN(Number(id)) ? `/api/poems/slug/${id}` : `/api/poems/${id}`;
        const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

async function getExecutablePath() {
    if (process.env.NODE_ENV === 'development' || process.platform === 'win32') {
        const localPaths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
            `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
        ];
        for (const p of localPaths) {
            if (fs.existsSync(p)) {
                return p;
            }
        }
        throw new Error('Chrome or Edge executable not found for local Puppeteer run.');
    }
    const { default: chromium } = await import('@sparticuz/chromium');
    return await chromium.executablePath();
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const paramsResolved = await params;
    const id = paramsResolved.id;
    let browser = null;

    try {
        // Resolve data first
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

        const executablePath = await getExecutablePath();
        const isLocal = process.platform === 'win32';

        let launchArgs = [];
        if (!isLocal) {
            const { default: chromium } = await import('@sparticuz/chromium');
            launchArgs = chromium.args;
        } else {
            launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
        }

        browser = await puppeteer.launch({
            args: launchArgs,
            defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
            executablePath: executablePath,
            headless: true,
        });

        const page = await browser.newPage();

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                @font-face {
                    font-family: 'Rozha One';
                    font-style: normal;
                    font-weight: 400;
                    src: url(https://fonts.gstatic.com/s/rozhaone/v17/AlZy_zVFtYP12Zncg2khdQ.ttf) format('truetype');
                }
                @font-face {
                    font-family: 'Poppins';
                    font-style: normal;
                    font-weight: 400;
                    src: url(https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrFJA.ttf) format('truetype');
                }
                @font-face {
                    font-family: 'Poppins';
                    font-style: normal;
                    font-weight: 500;
                    src: url(https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
                }
                * {
                    box-sizing: border-box;
                }
                body {
                    background-color: #faf9f6;
                    margin: 0;
                    padding: 0;
                    width: 1200px;
                    height: 630px;
                    overflow: hidden;
                    font-family: 'Poppins', sans-serif;
                }
                .outer-border {
                    width: 1200px;
                    height: 630px;
                    padding: 48px;
                    display: flex;
                }
                .middle-border {
                    width: 100%;
                    height: 100%;
                    border: 3px solid #84232C;
                    padding: 12px;
                    display: flex;
                }
                .inner-border {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #84232C;
                    padding: 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    width: 100%;
                }
                .title {
                    font-size: 104px;
                    line-height: 1;
                    color: #111827;
                    font-weight: bold;
                    max-width: 65%;
                    font-family: 'Rozha One', serif;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .logo-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    text-align: right;
                }
                .logo-img {
                    height: 112px;
                    width: auto;
                    margin-bottom: 8px;
                    object-fit: contain;
                }
                .logo-sub {
                    font-size: 24px;
                    color: #c5a059;
                    margin-top: 8px;
                    letter-spacing: 0.05em;
                    font-weight: 500;
                }
                .footer {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .author-section {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }
                .author-img-container {
                    width: 128px;
                    height: 128px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid #84232C;
                    background-color: #ffffff;
                    display: flex;
                }
                .author-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .author-info {
                    display: flex;
                    flex-direction: column;
                }
                .written-by {
                    font-size: 24px;
                    color: #6B7280;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 12px;
                    font-weight: 500;
                }
                .author-name {
                    font-size: 56px;
                    color: #84232C;
                    font-weight: bold;
                    font-family: 'Rozha One', serif;
                    margin: 0;
                    line-height: 1.1;
                }
                .snippet-section {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    max-width: 50%;
                    border-right: 4px solid #c5a059;
                    padding-right: 24px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    background: linear-gradient(to left, rgba(197, 160, 89, 0.1), transparent);
                }
                .snippet-text {
                    font-size: 28px;
                    color: #374151;
                    text-align: right;
                    font-family: 'Rozha One', serif;
                    line-height: 1.6;
                    font-style: italic;
                    white-space: pre-wrap;
                }
            </style>
        </head>
        <body>
            <div class="outer-border">
                <div class="middle-border">
                    <div class="inner-border">
                        <div class="header">
                            <span class="title">${title}</span>
                            <div class="logo-container">
                                <img src="https://godwa.space/godwa-logo.png" alt="Godwa Logo" class="logo-img" />
                                <span class="logo-sub">Marathi Literature</span>
                            </div>
                        </div>
                        <div class="footer">
                            <div class="author-section">
                                ${poetImageUrl ? `
                                <div class="author-img-container">
                                    <img src="${poetImageUrl}" alt="${poet}" class="author-img" />
                                </div>
                                ` : ''}
                                <div class="author-info">
                                    <span class="written-by">Written By</span>
                                    <h2 class="author-name">${poet}</h2>
                                </div>
                            </div>
                            <div class="snippet-section">
                                <span class="snippet-text">"${snippet}"</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'load' });

        // Wait for all web fonts to be fully loaded and ready
        await page.evaluateHandle(() => document.fonts.ready);

        // Take the screenshot
        const screenshot = await page.screenshot({ type: 'png' });

        // Re-wrap in a Uint8Array backed by a plain ArrayBuffer so the type
        // satisfies BodyInit.
        return new NextResponse(new Uint8Array(screenshot), {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        console.error('OG Image generation error:', error);
        return new Response('Internal Server Error', { status: 500 });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
