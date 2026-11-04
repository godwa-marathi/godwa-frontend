import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { LanguageProvider } from "@/lib/LanguageContext";
import { PoemFooter } from "./PoemFooter";
import { PoemOut, PoetOut } from "@/lib/types";

const poet: PoetOut = {
    id: 5, name: "कुसुमाग्रज", name_roman: "Kusumagraj",
    instagram_url: "https://instagram.com/kusum", contact_email: "k@example.com",
};
const poem = {
    id: 1, title: "t", body_marathi: "x", poet_id: 5, status: "approved", words: [], like_count: 0,
    tags: [
        { id: 2, name: "पाऊस", slug: "पाऊस", is_category: false },
        { id: 1, name: "Nature", slug: "nature", is_category: true },
    ],
    youtube_url: "https://youtube.com/@x",
} as PoemOut;

function renderFooter(p: PoemOut, po?: PoetOut) {
    return render(
        <LanguageProvider>
            <PoemFooter poem={p} poet={po} />
        </LanguageProvider>
    );
}

beforeEach(() => localStorage.clear());

describe("PoemFooter", () => {
    it("lists the category first, links tags to /explore?tag=, and links the poet", () => {
        renderFooter(poem, poet);
        const tags = within(screen.getByLabelText("Tags")).getAllByRole("link");
        expect(tags.map((a) => a.textContent)).toEqual(["Nature", "पाऊस"]);
        expect(tags[0].getAttribute("href")).toBe("/explore?tag=nature");
        expect(tags[1].getAttribute("href")).toBe(`/explore?tag=${encodeURIComponent("पाऊस")}`);
        expect(screen.getByText("कुसुमाग्रज").closest("a")?.getAttribute("href")).toBe("/poets/5");
    });

    it("renders only the links that are set, safely", () => {
        renderFooter(poem, poet);
        expect(screen.getByLabelText("Instagram: कुसुमाग्रज").getAttribute("href")).toBe("https://instagram.com/kusum");
        expect(screen.getByLabelText("Email: कुसुमाग्रज").getAttribute("href")).toBe("mailto:k@example.com");
        const yt = screen.getByLabelText("YouTube: this poem");
        expect(yt.getAttribute("rel")).toBe("noopener noreferrer");
        expect(yt.getAttribute("target")).toBe("_blank");
        expect(screen.queryByLabelText(/Website/)).toBeNull();
    });

    it("never renders non-http(s) URLs", () => {
        renderFooter({ ...poem, youtube_url: "javascript:alert(1)" } as PoemOut, { ...poet, instagram_url: "ftp://x" });
        expect(screen.queryByLabelText(/YouTube/)).toBeNull();
        expect(screen.queryByLabelText(/Instagram/)).toBeNull();
    });

    it("renders nothing without tags or a poet", () => {
        const { container } = renderFooter({ ...poem, tags: [], poet: undefined } as PoemOut, undefined);
        expect(container.textContent).toBe("");
    });
});
