import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/lib/LanguageContext";

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));
vi.mock("@/lib/api", () => ({ api: { get: apiGet } }));

import { PoemSuggestions } from "./PoemSuggestions";

function renderIt(excludeId = 7) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    return render(
        <QueryClientProvider client={qc}>
            <LanguageProvider>
                <PoemSuggestions excludeId={excludeId} />
            </LanguageProvider>
        </QueryClientProvider>
    );
}

beforeEach(() => {
    localStorage.clear();
    apiGet.mockReset();
});

describe("PoemSuggestions", () => {
    it("asks the API for random poems excluding the current one and links each by slug", async () => {
        apiGet.mockResolvedValue([
            { id: 1, title: "पहिली", url_slug: "pahili-by-a", poet: { id: 1, name: "कवी अ", name_roman: "Kavi A" } },
            { id: 2, title: "दुसरी", poet: { id: 2, name: "कवी ब" } },
        ]);
        renderIt(7);

        await waitFor(() => expect(screen.getByText("पहिली")).toBeTruthy());
        expect(apiGet).toHaveBeenCalledWith("/api/poems/random?exclude_id=7&limit=3");
        expect(screen.getByText("पहिली").closest("a")?.getAttribute("href")).toBe("/poem/pahili-by-a");
        // falls back to the numeric id when there is no slug
        expect(screen.getByText("दुसरी").closest("a")?.getAttribute("href")).toBe("/poem/2");
        expect(screen.getByText("कवी अ")).toBeTruthy();
    });

    it("renders nothing when there are no suggestions", async () => {
        apiGet.mockResolvedValue([]);
        const { container } = renderIt();
        await waitFor(() => expect(apiGet).toHaveBeenCalled());
        expect(container.querySelector("a")).toBeNull();
        expect(container.textContent).toBe("");
    });
});
