import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { apiGet, apiPost, apiPatch, apiDelete } = vi.hoisted(() => ({
    apiGet: vi.fn(), apiPost: vi.fn(), apiPatch: vi.fn(), apiDelete: vi.fn(),
}));
vi.mock("@/lib/api", () => ({ api: { get: apiGet, post: apiPost, patch: apiPatch, delete: apiDelete } }));
vi.mock("@/components/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/AdminGuard", () => ({ AdminGuard: ({ children }: any) => <>{children}</> }));

import AdminTagsPage from "./page";

const TAGS = [
    { id: 1, name: "Nature", slug: "nature", is_category: true, poem_count: 3 },
    { id: 2, name: "rain", slug: "rain", is_category: false, poem_count: 1 },
];

function setup() {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={qc}>
            <AdminTagsPage />
        </QueryClientProvider>
    );
}

beforeEach(() => {
    [apiGet, apiPost, apiPatch, apiDelete].forEach((m) => m.mockReset());
    apiGet.mockResolvedValue(TAGS);
    apiPost.mockResolvedValue({});
    apiPatch.mockResolvedValue({});
    apiDelete.mockResolvedValue({ deleted: true, unlinked_poems: 3 });
});

describe("Admin tags page", () => {
    it("lists tags with usage counts and creates a category", async () => {
        const user = userEvent.setup();
        setup();
        await waitFor(() => expect(screen.getByText("Nature")).toBeTruthy());
        expect(screen.getByText("3 poems")).toBeTruthy();

        await user.type(screen.getByLabelText("New tag name"), "Devotional");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await waitFor(() => expect(apiPost).toHaveBeenCalledWith("/api/admin/tags", { name: "Devotional", is_category: true }));
    });

    it("renames a tag", async () => {
        const user = userEvent.setup();
        setup();
        await waitFor(() => screen.getByText("rain"));
        await user.click(screen.getByLabelText("Rename rain"));
        const input = screen.getByLabelText("Rename rain");
        await user.clear(input);
        await user.type(input, "monsoon");
        await user.click(screen.getByLabelText("Save name"));
        await waitFor(() => expect(apiPatch).toHaveBeenCalledWith("/api/admin/tags/2", { name: "monsoon" }));
    });

    it("toggles category and deletes only after confirmation", async () => {
        const user = userEvent.setup();
        const confirm = vi.spyOn(window, "confirm");
        setup();
        await waitFor(() => screen.getByText("rain"));

        await user.click(screen.getByLabelText("rain is a category"));
        await waitFor(() => expect(apiPatch).toHaveBeenCalledWith("/api/admin/tags/2", { is_category: true }));

        confirm.mockReturnValueOnce(false);
        await user.click(screen.getByLabelText("Delete Nature"));
        expect(apiDelete).not.toHaveBeenCalled();

        confirm.mockReturnValueOnce(true);
        await user.click(screen.getByLabelText("Delete Nature"));
        expect(confirm.mock.calls.at(-1)![0]).toContain("3 poems");
        await waitFor(() => expect(apiDelete).toHaveBeenCalledWith("/api/admin/tags/1"));
    });
});
