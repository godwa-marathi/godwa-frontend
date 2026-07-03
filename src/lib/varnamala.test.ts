import { describe, it, expect } from "vitest";
import { DEVANAGARI_VARNAMALA, ROMAN_ALPHABET, getAlphabet } from "./varnamala";

describe("varnamala", () => {
    it("includes core Devanagari vowels and consonants", () => {
        expect(DEVANAGARI_VARNAMALA).toContain("अ");
        expect(DEVANAGARI_VARNAMALA).toContain("आ");
        expect(DEVANAGARI_VARNAMALA).toContain("क");
        expect(DEVANAGARI_VARNAMALA).toContain("ळ");
        expect(DEVANAGARI_VARNAMALA).toContain("ह");
    });

    it("excludes conjuncts, which index under their first codepoint", () => {
        expect(DEVANAGARI_VARNAMALA).not.toContain("क्ष");
        expect(DEVANAGARI_VARNAMALA).not.toContain("ज्ञ");
    });

    it("contains only single-codepoint letters (must match substr(name,1,1))", () => {
        for (const letter of DEVANAGARI_VARNAMALA) {
            expect([...letter]).toHaveLength(1);
        }
    });

    it("has no duplicate letters", () => {
        expect(new Set(DEVANAGARI_VARNAMALA).size).toBe(DEVANAGARI_VARNAMALA.length);
    });

    it("Roman alphabet is A–Z", () => {
        expect(ROMAN_ALPHABET).toHaveLength(26);
        expect(ROMAN_ALPHABET[0]).toBe("A");
        expect(ROMAN_ALPHABET.at(-1)).toBe("Z");
    });

    it("getAlphabet returns the right set per language", () => {
        expect(getAlphabet("roman")).toBe(ROMAN_ALPHABET);
        expect(getAlphabet("devanagari")).toBe(DEVANAGARI_VARNAMALA);
    });
});
