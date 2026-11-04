import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/lib/LanguageContext";

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));
vi.mock("@/lib/api", () => ({ api: { get: apiGet } }));
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "1" }) }));
vi.mock("@/lib/AuthContext", () => ({ useAuth: () => ({ user: null, token: null, isLoading: false }) }));
vi.mock("@/components/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/Cards", () => ({ PoemCard: () => null }));

import { PoetProfileClientView } from "./PoetProfileClientView";

function renderProfile() {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    return render(
        <QueryClientProvider client={qc}>
            <LanguageProvider>
                <PoetProfileClientView />
            </LanguageProvider>
        </QueryClientProvider>
    );
}

beforeEach(() => {
    localStorage.clear();
    apiGet.mockReset();
    apiGet.mockImplementation((url: string) =>
        url.startsWith("/api/poets/")
            ? Promise.resolve({ id: 1, name: "कुसुमाग्रज", name_roman: "Kusumagraj", bio: "bio" })
            : Promise.resolve([])
    );
});

describe("Poet profile", () => {
    it("does not show the 'Grand Master' / 'महान कवी' badge", async () => {
        const { container } = renderProfile();
        await waitFor(() => expect(screen.getAllByText(/कुसुमाग्रज/).length).toBeGreaterThan(0));
        expect(container.textContent).not.toMatch(/Grand Master/i);
        expect(container.textContent).not.toContain("महान कवी");
    });
});
