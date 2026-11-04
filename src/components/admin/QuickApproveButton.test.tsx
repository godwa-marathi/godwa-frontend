import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { apiPost } = vi.hoisted(() => ({ apiPost: vi.fn() }));
vi.mock("@/lib/api", () => ({ api: { post: apiPost } }));

import { QuickApproveButton } from "./QuickApproveButton";

function wrap(ui: React.ReactElement) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const result = {
    status: "approved", poem_id: 7, newly_approved: true, meaning_generated: true,
    new_words: 3, linked_words: 2, total_words: 5, words_missing_meaning: 2,
};

beforeEach(() => {
    apiPost.mockReset(); // block body: a function returned from beforeEach is run as teardown
});

describe("QuickApproveButton", () => {
    it("asks for confirmation and does not call the API until confirmed", async () => {
        const user = userEvent.setup();
        wrap(<QuickApproveButton poemId={7} />);
        await user.click(screen.getByRole("button", { name: /quick approve/i }));
        expect(apiPost).not.toHaveBeenCalled();

        await user.click(screen.getByRole("button", { name: /cancel/i }));
        expect(apiPost).not.toHaveBeenCalled();
        expect(screen.getByRole("button", { name: /quick approve/i })).toBeTruthy();
    });

    it("posts to quick-approve and shows the summary", async () => {
        apiPost.mockResolvedValue(result);
        const onDone = vi.fn();
        const user = userEvent.setup();
        wrap(<QuickApproveButton poemId={7} onDone={onDone} />);

        await user.click(screen.getByRole("button", { name: /quick approve/i }));
        await user.click(screen.getByRole("button", { name: /confirm$/i }));

        await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/Published/));
        expect(apiPost).toHaveBeenCalledWith("/api/admin/poems/7/quick-approve", {});
        const text = screen.getByRole("status").textContent!;
        expect(text).toMatch(/5 words \(3 new, 2 linked\)/);
        expect(text).toMatch(/2 still have no meaning/);
        expect(onDone).toHaveBeenCalledWith(result);
    });

    it("shows the error and does not report success when the API fails", async () => {
        apiPost.mockImplementation(() => Promise.reject(new Error("AI did not return a meaning; the poem was not approved")));
        const onDone = vi.fn();
        const user = userEvent.setup();
        wrap(<QuickApproveButton poemId={7} onDone={onDone} />);

        await user.click(screen.getByRole("button", { name: /quick approve/i }));
        await user.click(screen.getByRole("button", { name: /confirm$/i }));

        await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/AI did not return a meaning/));
        expect(onDone).not.toHaveBeenCalled();
        expect(screen.getByRole("button", { name: /quick approve/i })).toBeTruthy(); // can retry
    });
});
