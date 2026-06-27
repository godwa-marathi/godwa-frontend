// Pratham Transliteration Style for Marathi (Frontend implementation matching marathi-shabda 0.2.0)

const VOWEL_LETTERS: Record<string, string> = {
    'अ': 'a',   'आ': 'aa',  'इ': 'i',   'ई': 'ii',
    'उ': 'u',   'ऊ': 'uu',  'ए': 'e',   'ऐ': 'ai',
    'ओ': 'o',   'औ': 'au',  'ऋ': 'ri',  'ॠ': 'rii',
    'ऌ': 'li',
};

const VOWEL_SIGNS: Record<string, string> = {
    '\u093E': 'aa',   // ा
    '\u093F': 'i',    // ि
    '\u0940': 'ii',   // ी
    '\u0941': 'u',    // ु
    '\u0942': 'uu',   // ू
    '\u0947': 'e',    // े
    '\u0948': 'ai',   // ै
    '\u094B': 'o',    // ो
    '\u094C': 'au',   // ौ
    '\u0943': 'ri',   // ृ
    '\u0944': 'rii',  // ॄ
};

const CONSONANTS: Record<string, string> = {
    'क': 'k',    'ख': 'kh',  'ग': 'g',   'घ': 'gh',   'ङ': 'ng',
    'च': 'ch',   'छ': 'chh', 'ज': 'j',   'झ': 'jh',   'ञ': 'ny',
    'ट': 'T',    'ठ': 'Th',  'ड': 'D',   'ढ': 'Dh',   'ण': 'N',
    'त': 't',    'थ': 'th',  'द': 'd',   'ध': 'dh',   'न': 'n',
    'प': 'p',    'फ': 'ph',  'ब': 'b',   'भ': 'bh',   'म': 'm',
    'य': 'y',    'र': 'r',   'ल': 'l',   'व': 'v',
    'श': 'sh',   'ष': 'Sh',  'स': 's',   'ह': 'h',
    'ळ': 'L',    '\u0931': 'R',
};

const NUKTA = '\u093C';
const VIRAMA = '\u094D';
const ANUSVARA = '\u0902';
const CHANDRABINDU = '\u0901';
const VISARGA = '\u0903';

const NUKTA_CONSONANTS: Record<string, string> = {
    ['ख' + NUKTA]: 'KH',
    ['ग' + NUKTA]: 'G',
    ['ज' + NUKTA]: 'z',
    ['ड' + NUKTA]: '.D',
    ['ढ' + NUKTA]: '.Dh',
    ['फ' + NUKTA]: 'f',
    ['क' + NUKTA]: 'q',
};

const VELAR = new Set('कखगघङ');
const PALATAL = new Set('चछजझञ');
const RETROFLEX = new Set('टठडढणळ\u0931');
const DENTAL = new Set('तथदधन');
const LABIAL = new Set('पफबभम');

function getAnusvaraRoman(nextChar: string | null): string {
    if (!nextChar) return '.n';
    if (VELAR.has(nextChar)) return 'ng';
    if (PALATAL.has(nextChar)) return 'ny';
    if (RETROFLEX.has(nextChar)) return 'N';
    if (DENTAL.has(nextChar)) return 'n';
    if (LABIAL.has(nextChar)) return 'm';
    return '.n';
}

function wordToRoman(word: string): string {
    const result: string[] = [];
    let i = 0;
    const n = word.length;

    const handleModifiers = () => {
        if (i < n) {
            if (word[i] === ANUSVARA) {
                const lookahead = i + 1 < n ? word[i + 1] : null;
                result.push(getAnusvaraRoman(lookahead));
                i++;
            } else if (word[i] === CHANDRABINDU) {
                result.push('ñ');
                i++;
            }
        }
    };

    while (i < n) {
        const ch = word[i];

        if (ch in VOWEL_LETTERS) {
            result.push(VOWEL_LETTERS[ch]);
            i++;
            handleModifiers();
        } else if (ch in CONSONANTS) {
            let romanCon = CONSONANTS[ch];
            if (i + 1 < n && word[i + 1] === NUKTA) {
                const key = ch + NUKTA;
                romanCon = NUKTA_CONSONANTS[key] || CONSONANTS[ch];
                i += 2;
            } else {
                i++;
            }

            result.push(romanCon);

            if (i >= n) {
                // Word-final schwa deletion
            } else if (word[i] === VIRAMA) {
                i++;
            } else if (word[i] in VOWEL_SIGNS) {
                result.push(VOWEL_SIGNS[word[i]]);
                i++;
                handleModifiers();
            } else {
                result.push('a');
                handleModifiers();
            }
        } else if (ch === ANUSVARA) {
            const lookahead = i + 1 < n ? word[i + 1] : null;
            result.push(getAnusvaraRoman(lookahead));
            i++;
        } else if (ch === CHANDRABINDU) {
            result.push('ñ');
            i++;
        } else if (ch === VISARGA) {
            result.push('h');
            i++;
        } else {
            result.push(ch);
            i++;
        }
    }

    return result.join('');
}

export function devToRoman(text: string): string {
    if (!text) return text;
    return text.split(' ').map(p => p ? wordToRoman(p) : '').join(' ');
}

export function titleCasePreserveFormat(text: string): string {
    if (!text) return text;
    return text.replace(/[a-zA-Z\.]+/g, (word) => {
        if (!word) return word;
        return word[0].toUpperCase() + word.slice(1);
    });
}

export function capitalizeFirstWord(text: string): string {
    if (!text) return text;
    const index = text.search(/[a-zA-Z]/);
    if (index !== -1) {
        return text.slice(0, index) + text.charAt(index).toUpperCase() + text.slice(index + 1);
    }
    return text;
}

export function transliterateMarathi(text: string, capitalizeFirst: boolean = false): string {
    const pratham = devToRoman(text);
    return capitalizeFirst ? capitalizeFirstWord(pratham) : pratham;
}
