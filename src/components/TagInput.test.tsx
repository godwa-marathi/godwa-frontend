import React, { useState } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));
vi.mock("@/lib/api", () => ({ api: { get: apiGet } }));

import { TagInput } from "./TagInput";

function Harness({ initial = [] as string[], max = 10 }) {
    const [tags, setTags] = useState<string[]>(initial);
    return <TagInput value={tags} onChange={setTags} max={max} />;
}

function setup(props = {}) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={qc}>
            <Harness {...props} />
        </QueryClientProvider>
    );
}

beforeEach(() => {
    apiGet.mockReset();
    apiGet.mockResolvedValue([]);
});

describe("TagInput", () => {
    it("adds chips on Enter and comma, trims '#', and ignores duplicates (case-insensitive)", async () => {
        const user = userEvent.setup();
        setup();
        const input = screen.getByLabelText("Tags");

        await user.type(input, "#प्रेम{Enter}");
        await user.type(input, "Rain,");
        await user.type(input, "rain{Enter}");

        expect(screen.getByText("प्रेम")).toBeTruthy();
        expect(screen.getAllByText(/^rain$/i)).toHaveLength(1);
    });

    it("removes a chip with its button and with Backspace", async () => {
        const user = userEvent.setup();
        setup({ initial: ["a", "b"] });
        await user.click(screen.getByLabelText("Remove tag a"));
        expect(screen.queryByText("a")).toBeNull();
        await user.type(screen.getByLabelText("Tags"), "{Backspace}");
        expect(screen.queryByText("b")).toBeNull();
    });

    it("enforces the maximum number of tags", async () => {
        const user = userEvent.setup();
        setup({ initial: ["a", "b"], max: 2 });
        await user.type(screen.getByLabelText("Tags"), "c{Enter}");
        expect(screen.getByRole("alert").textContent).toContain("up to 2");
        expect(screen.queryByText("c")).toBeNull();
    });

    it("suggests existing non-category tags and adds one on click", async () => {
        apiGet.mockResolvedValue([
            { id: 1, name: "rainy", slug: "rainy", is_category: false, poem_count: 2 },
            { id: 2, name: "Nature", slug: "nature", is_category: true, poem_count: 5 },
        ]);
        const user = userEvent.setup();
        setup();
        await user.type(screen.getByLabelText("Tags"), "ra");
        await waitFor(() => expect(screen.getByText("+ rainy")).toBeTruthy());
        expect(screen.queryByText("+ Nature")).toBeNull(); // categories come from the dropdown
        expect(apiGet.mock.calls.at(-1)![0]).toContain("/api/tags?q=ra");

        await user.click(screen.getByText("+ rainy"));
        expect(screen.getByText("rainy")).toBeTruthy();
    });
});
