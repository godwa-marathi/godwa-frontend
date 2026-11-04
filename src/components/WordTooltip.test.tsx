import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn().mockResolvedValue([]) } }));

// Radix Tooltip measures its content with ResizeObserver, which jsdom does not implement.
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver ?? ResizeObserverStub;

import { LanguageProvider } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";
import { WordTooltip } from "./WordTooltip";
import { WordOut } from "@/lib/types";

// Matches the message in either UI language (the provider's default may be Marathi).
const NO_MEANING = new RegExp(
    Object.values(translations)
        .map((d) => d.word_no_meaning_body.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")
);

function wrap(ui: React.ReactElement) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={qc}>
            <LanguageProvider>{ui}</LanguageProvider>
        </QueryClientProvider>
    );
}

describe("WordTooltip missing meaning", () => {
    it("explains that a known word has no meaning in the database yet", () => {
        const data = { id: 1, devnagri: "अज्ञात", definition_en: null, definition_mr: null } as unknown as WordOut;
        wrap(<WordTooltip word="अज्ञात" data={data} isOpen onOpenChange={() => {}} />);
        expect(screen.getAllByText(NO_MEANING).length).toBeGreaterThan(0);
    });

    it("does not show the message when a definition exists", () => {
        const data = { id: 1, devnagri: "पाणी", definition_en: "water", definition_mr: null } as unknown as WordOut;
        wrap(<WordTooltip word="पाणी" data={data} isOpen onOpenChange={() => {}} />);
        expect(screen.getAllByText("water").length).toBeGreaterThan(0);
        expect(screen.queryByText(NO_MEANING)).toBeNull();
    });
});
