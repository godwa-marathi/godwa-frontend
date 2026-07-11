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
        chromium.setHeadlessMode = true;
        chromium.setGraphicsMode = false;

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

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

        return new NextResponse(screenshot, {
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
