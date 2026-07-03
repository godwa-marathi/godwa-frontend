// ---------------------------------------------------------------------------
// Marathi varnamala (वर्णमाला) — the canonical alphabet index for the poets
// directory's AlphabetStrip.
//
// This is deliberately STATIC and client-side. The strip always shows the full
// alphabet; clicking a letter with no poets falls through to the page's empty
// state ("no poets under X"). The backend therefore does not compute the set of
// populated letters — that previously meant a full-table scan on every request.
//
// Indexing rule: a poet is filed under the FIRST Unicode codepoint of its
// display name (see the backend letter filter in app/routers/poets.py, which
// matches on `substr(name, 1, 1)`). So these lists contain only single base
// letters. Conjuncts such as क्ष and ज्ञ are intentionally omitted — names
// under them index by their first codepoint (क and ज respectively) — as are
// anusvara/visarga, which never begin a name on their own.
// ---------------------------------------------------------------------------

/** Vowels (स्वर) that can begin a name. */
const DEVANAGARI_VOWELS = [
    "अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ",
];

/** Consonants (व्यंजन), including ळ. */
const DEVANAGARI_CONSONANTS = [
    "क", "ख", "ग", "घ", "ङ",
    "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण",
    "त", "थ", "द", "ध", "न",
    "प", "फ", "ब", "भ", "म",
    "य", "र", "ल", "व",
    "श", "ष", "स", "ह", "ळ",
];

/** Full Devanagari index: vowels first, then consonants (varnamala order). */
export const DEVANAGARI_VARNAMALA: string[] = [
    ...DEVANAGARI_VOWELS,
    ...DEVANAGARI_CONSONANTS,
];

/** Roman alphabet A–Z. */
export const ROMAN_ALPHABET: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
);

/** Return the alphabet index for the given UI language. */
export function getAlphabet(language: "devanagari" | "roman"): string[] {
    return language === "roman" ? ROMAN_ALPHABET : DEVANAGARI_VARNAMALA;
}
