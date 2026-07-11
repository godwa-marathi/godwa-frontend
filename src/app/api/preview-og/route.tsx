import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// We fetch the Google font to ensure perfect Devanagari rendering
const fetchFont = async () => {
    const res = await fetch('https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Bold.ttf');
    return res.arrayBuffer();
};

export async function GET(req: NextRequest) {
    const fontData = await fetchFont();

    const title = 'डियर ग्रेस';
    const poet = 'वैभव जोशी';
    const snippet = 'सृजनाच्या पानोठ्यावर येतात प्रवासी पक्षी...';
    
    const bgCream = '#faf9f6';
    const colorMaroon = '#84232C';
    const colorGold = '#c5a059';

    const content = (
        <div tw={`flex w-full h-full bg-[${bgCream}] p-12`}>
            <div tw={`flex w-full h-full border-4 border-[${colorMaroon}] p-4`}>
                <div tw={`flex flex-col w-full h-full border-2 border-[${colorMaroon}] p-12 justify-between`}>
                    <div tw="flex justify-between items-start w-full">
                        <h1 tw="text-8xl text-gray-900 font-bold">{title}</h1>
                        <div tw="flex flex-col items-end">
                            <span tw={`text-5xl text-[${colorMaroon}] font-bold`}>Godwa</span>
                            <span tw={`text-2xl text-[${colorGold}] mt-2`}>Marathi Literature</span>
                        </div>
                    </div>
                    <div tw="flex w-full justify-between items-end">
                        <div tw="flex flex-col">
                            <span tw="text-3xl text-gray-500 uppercase tracking-widest mb-4">Written By</span>
                            <span tw={`text-6xl text-[${colorMaroon}] font-bold`}>{poet}</span>
                        </div>
                        <div tw="text-3xl text-gray-500 text-right">
                            {snippet}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return new ImageResponse(content, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: 'Noto Sans Devanagari',
                data: fontData,
                style: 'normal',
                weight: 700,
            }
        ],
    });
}
