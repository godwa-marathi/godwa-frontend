import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlphabetStrip } from "./AlphabetStrip";

const LETTERS = ["अ", "क", "ब"];

describe("AlphabetStrip", () => {
    it("renders every given letter plus the All button", () => {
        render(
            <AlphabetStrip
                letters={LETTERS}
                activeLetter={null}
                onLetterClick={() => {}}
                allLabel="All"
            />
        );
        expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
        for (const letter of LETTERS) {
            expect(screen.getByRole("button", { name: letter })).toBeInTheDocument();
        }
    });

    it("calls onLetterClick with the clicked letter", async () => {
        const onLetterClick = vi.fn();
        render(
            <AlphabetStrip
                letters={LETTERS}
                activeLetter={null}
                onLetterClick={onLetterClick}
                allLabel="All"
            />
        );
        await userEvent.click(screen.getByRole("button", { name: "क" }));
        expect(onLetterClick).toHaveBeenCalledWith("क");
    });

    it("calls onLetterClick(null) when All is clicked", async () => {
        const onLetterClick = vi.fn();
        render(
            <AlphabetStrip
                letters={LETTERS}
                activeLetter="क"
                onLetterClick={onLetterClick}
                allLabel="All"
            />
        );
        await userEvent.click(screen.getByRole("button", { name: "All" }));
        expect(onLetterClick).toHaveBeenCalledWith(null);
    });

    it("marks the active letter with aria-current", () => {
        render(
            <AlphabetStrip
                letters={LETTERS}
                activeLetter="क"
                onLetterClick={() => {}}
                allLabel="All"
            />
        );
        expect(screen.getByRole("button", { name: "क" })).toHaveAttribute(
            "aria-current",
            "true"
        );
        expect(screen.getByRole("button", { name: "ब" })).not.toHaveAttribute(
            "aria-current"
        );
    });
});
