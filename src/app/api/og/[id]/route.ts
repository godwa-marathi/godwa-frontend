import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Ensure the Serverless function has enough time to launch Chromium
export const maxDuration = 20;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const paramsResolved = await params;
    const id = paramsResolved.id;
    let browser = null;

    try {
        // Vercel Serverless Function requirements
        chromium.setGraphicsMode = false;

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 1 },
            executablePath: await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage();

        // Build the correct URL dynamically based on the current host
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const url = `${protocol}://${host}/og-template?id=${id}`;

        // Load the React component template
        const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        
        if (!response?.ok()) {
            throw new Error(`Failed to load template for ID: ${id}`);
        }

        // Take the screenshot
        const screenshot = await page.screenshot({ type: 'png' });

        // Re-wrap in a Uint8Array backed by a plain ArrayBuffer so the type
        // satisfies BodyInit (Uint8Array<ArrayBufferLike> is not assignable).
        return new NextResponse(new Uint8Array(screenshot), {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        console.error('OG Image generation error:', error);
        // Fallback to a static image or return 500
        return new NextResponse('Internal Server Error', { status: 500 });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
