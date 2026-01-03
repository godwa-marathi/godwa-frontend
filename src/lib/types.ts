export interface WordOut {
    id: number;
    devnagri: string;
    inscript?: string;
    gender?: string;
    definition_en?: string;
    definition_mr?: string;
    pronunciation?: string;
    metadata_json?: any;
}

export interface PoetOut {
    id: number;
    name: string;
    name_roman?: string;
    bio?: string;
    image_url?: string;
    life_span?: string; // e.g., "1850 - 1920"
    poem_count?: number;
}

export interface PoemOut {
    id: number;
    title: string;
    title_roman?: string;
    body_marathi: string;
    body_roman?: string;
    poet_id: number;
    poet?: PoetOut;
    book_id?: number;
    chhanda_id?: number;
    chhanda_name?: string;
    genre?: string;
    description?: string;
    status: 'draft' | 'pending' | 'approved';
    words: WordOut[];
}

export interface PoetSearchResponse {
    results: PoetOut[];
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface ScannerResponse {
    text: string;
    image_url: string;
}

export interface AnalysisResponse {
    chhanda_name?: string;
    chhanda_id?: number;
    mood?: string;
}
