import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { apiGet, apiPatch, auth } = vi.hoisted(() => ({
    apiGet: vi.fn(),
    apiPatch: vi.fn(),
    auth: { user: null as any },
}));
vi.mock("@/lib/api", () => ({ api: { get: apiGet, patch: apiPatch } }));
vi.mock("@/lib/AuthContext", () => ({ useAuth: () => ({ user: auth.user, token: "t", isLoading: false }) }));

import { AdminPoemTools } from "./AdminPoemTools";
import { AdminPoetTools } from "./AdminPoetTools";
import { PoemOut, PoetOut } from "@/lib/types";

const poem = {
    id: 9, title: "जुने", body_marathi: "ओळ", poet_id: 1, status: "approved", words: [], like_count: 0,
    description: "d",
    tags: [
        { id: 1, name: "Nature", slug: "nature", is_category: true },
        { id: 2, name: "rain", slug: "rain", is_category: false },
    ],
} as PoemOut;
const poet = { id: 1, name: "कवी", name_roman: "Kavi" } as PoetOut;

function wrap(ui: React.ReactElement) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    apiGet.mockReset();
    apiPatch.mockReset();
    auth.user = null;
    apiGet.mockImplementation((url: string) => {
        if (url.startsWith("/api/tags")) return Promise.resolve([{ id: 1, name: "Nature", slug: "nature", is_category: true, poem_count: 1 }]);
        if (url.includes("/changelog")) {
            return Promise.resolve([{
                id: 1, action: "edit", created_at: "2026-11-04T10:00:00", admin: { id: 1, name: "Godwa Admin" },
                changes: { title: { old: "a", new: "b" } },
            }]);
        }
        return Promise.resolve([]);
    });
    apiPatch.mockResolvedValue({});
});

describe("AdminPoemTools", () => {
    it("renders nothing and fetches nothing for non-admins", () => {
        auth.user = { id: 5, is_admin: false };
        const { container } = wrap(<AdminPoemTools poem={poem} poet={poet} />);
        expect(container.textContent).toBe("");
        expect(apiGet).not.toHaveBeenCalled();
    });

    it("renders nothing for anonymous visitors", () => {
        const { container } = wrap(<AdminPoemTools poem={poem} poet={poet} />);
        expect(container.textContent).toBe("");
    });

    it("loads the changelog only when opened", async () => {
        auth.user = { id: 1, is_admin: true };
        const user = userEvent.setup();
        wrap(<AdminPoemTools poem={poem} poet={poet} />);
        expect(apiGet).not.toHaveBeenCalledWith("/api/admin/poems/9/changelog");

        await user.click(screen.getByRole("button", { name: /changelog/i }));
        await waitFor(() => expect(screen.getByLabelText("Changelog")).toBeTruthy());
        expect(screen.getByText("Edited")).toBeTruthy();
        expect(screen.getByText("b")).toBeTruthy();
        expect(screen.getByText(/Godwa Admin/)).toBeTruthy();
    });

    it("saves only the changed fields", async () => {
        auth.user = { id: 1, is_admin: true };
        const user = userEvent.setup();
        wrap(<AdminPoemTools poem={poem} poet={poet} />);

        await user.click(screen.getByRole("button", { name: /edit poem/i }));
        const title = screen.getByLabelText("Title");
        await user.clear(title);
        await user.type(title, "नवे");
        await user.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => expect(apiPatch).toHaveBeenCalledTimes(1));
        expect(apiPatch).toHaveBeenCalledWith("/api/admin/poems/9", { title: "नवे" });
    });

    it("shows the server error and keeps the form open", async () => {
        auth.user = { id: 1, is_admin: true };
        apiPatch.mockRejectedValue(new Error("Link must be a full http(s) URL"));
        const user = userEvent.setup();
        wrap(<AdminPoemTools poem={poem} poet={poet} />);

        await user.click(screen.getByRole("button", { name: /edit poem/i }));
        // Valid for the browser's url input, rejected by the API (http/https only).
        await user.type(screen.getByLabelText("Website"), "ftp://example.com");
        await user.click(screen.getByRole("button", { name: /save/i }));
        await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("full http(s) URL"));
        expect(screen.getByRole("form", { name: "Edit poem" })).toBeTruthy();
    });
});

describe("AdminPoetTools", () => {
    it("is hidden for non-admins", () => {
        auth.user = { id: 5, is_admin: false };
        const { container } = wrap(<AdminPoetTools poet={poet} />);
        expect(container.textContent).toBe("");
    });

    it("sends only changed fields and null for a cleared date", async () => {
        auth.user = { id: 1, is_admin: true };
        const user = userEvent.setup();
        wrap(<AdminPoetTools poet={{ ...poet, date_of_death: "1999-03-10" }} />);

        await user.click(screen.getByRole("button", { name: /edit poet/i }));
        await user.type(screen.getByLabelText("Instagram"), "https://instagram.com/kavi");
        await user.clear(screen.getByLabelText("Died"));
        await user.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => expect(apiPatch).toHaveBeenCalledWith("/api/admin/poets/1", {
            instagram_url: "https://instagram.com/kavi",
            date_of_death: null,
        }));
    });
});
