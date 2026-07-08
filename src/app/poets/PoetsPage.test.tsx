import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/lib/LanguageContext";

// Mock the API layer so we can drive responses and inspect the request URL.
const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));
vi.mock("@/lib/api", () => ({ api: { get: apiGet } }));

// Isolate the page from unrelated chrome (Navbar/Footer may use the Next router)
// and from the PoetCard's internals — none are under test here.
vi.mock("@/components/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/Cards", () => ({
    PoetCard: ({ poet }: { poet: { name: string } }) => (
        <div data-testid="poet-card">{poet.name}</div>
    ),
}));

import PoetsPage from "./page";

function makeResponse(overrides: Record<string, unknown> = {}) {
    return {
        items: [{ id: 1, name: "कुसुमाग्रज", name_roman: "Kusumagraj" }],
        total: 1,
        page: 1,
        page_size: 20,
        total_pages: 1,
        ...overrides,
    };
}

function renderPage() {
    const qc = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    return render(
        <QueryClientProvider client={qc}>
            <LanguageProvider>
                <PoetsPage />
            </LanguageProvider>
        </QueryClientProvider>
    );
}

/** Decoded text of the most recent api.get(endpoint) call. */
function lastCall(): string {
    return decodeURIComponent(apiGet.mock.calls.at(-1)![0] as string);
}

beforeEach(() => {
    apiGet.mockReset();
    apiGet.mockResolvedValue(makeResponse());
    localStorage.clear();
    window.location.hash = "";
});

describe("PoetsPage wiring", () => {
    it("fetches page 1 in devanagari on mount without hardcoding page_size", async () => {
        renderPage();
        await waitFor(() => expect(apiGet).toHaveBeenCalled());
        const call = decodeURIComponent(apiGet.mock.calls[0][0] as string);
        expect(call).toContain("/api/poets/");
        expect(call).toContain("page=1");
        expect(call).toContain("language=devanagari");
        // page_size is not a frontend literal — the backend default (20) governs.
        expect(call).not.toContain("page_size");
    });

    it("surfaces the API-provided page_size (default 20) on the response", async () => {
        renderPage();
        await waitFor(() => expect(apiGet).toHaveBeenCalled());
        // The mocked API returns the backend default of 20 (see makeResponse).
        expect((await apiGet.mock.results[0].value).page_size).toBe(20);
    });

    it("always renders the full varnamala (incl. letters absent from results)", async () => {
        renderPage();
        await waitFor(() => expect(apiGet).toHaveBeenCalled());
        // घ has no poet in the mocked response but must still be shown.
        expect(screen.getAllByRole("button", { name: "घ" }).length).toBeGreaterThan(0);
        // Conjuncts are intentionally not shown as separate buttons.
        expect(screen.queryAllByRole("button", { name: "ज्ञ" })).toHaveLength(0);
    });

    it("clicking a letter refetches filtered by that letter, resetting to page 1", async () => {
        renderPage();
        await waitFor(() => expect(apiGet).toHaveBeenCalled());

        await userEvent.click(screen.getAllByRole("button", { name: "क" })[0]);

        await waitFor(() => expect(lastCall()).toContain("letter=क"));
        expect(lastCall()).toContain("page=1");
    });

    it("toggling sort refetches with sort=desc in devanagari", async () => {
        renderPage();
        await waitFor(() => expect(apiGet).toHaveBeenCalled());

        const sortButton = screen.getByText("अ → ज्ञ").closest("button")!;
        await userEvent.click(sortButton);

        await waitFor(() => expect(lastCall()).toContain("sort=desc"));
        expect(lastCall()).toContain("language=devanagari");
    });

    it("renders A–Z and sorts in roman when the language is roman", async () => {
        localStorage.setItem("godwa_language", "roman");
        renderPage();

        // Language flips to roman after the provider's mount effect -> refetch.
        await waitFor(() => expect(lastCall()).toContain("language=roman"));

        expect(screen.getAllByRole("button", { name: "A" }).length).toBeGreaterThan(0);
        expect(screen.queryAllByRole("button", { name: "क" })).toHaveLength(0);

        const sortButton = screen.getByText("A → Z").closest("button")!;
        await userEvent.click(sortButton);

        await waitFor(() => {
            const call = lastCall();
            expect(call).toContain("sort=desc");
            expect(call).toContain("language=roman");
        });
    });

    it("shows a letter-specific empty message when the letter has no poets", async () => {
        apiGet.mockResolvedValue(makeResponse({ items: [], total: 0 }));
        renderPage();
        await waitFor(() => expect(apiGet).toHaveBeenCalled());

        await userEvent.click(screen.getAllByRole("button", { name: "क" })[0]);

        // The empty state renders the "…अक्षराखाली…" (under letter X) message.
        await waitFor(() =>
            expect(screen.getByText(/अक्षराखाली/)).toBeInTheDocument()
        );
    });
});
