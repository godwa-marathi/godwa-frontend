export interface WordOut {
    id: number;
    devnagri: string;
    word?: string; // New API field
    word_alternate?: string; // New API field
    definition_primary?: string; // New API field
    definition_secondary?: string; // New API field
    script_detected?: string; // New API field
    inscript?: string;
    gender?: string;
    definition_en?: string;
    definition_mr?: string;
    pronunciation?: string;
    metadata_json?: any;
}

export interface UserProfile {
    id: number;
    email: string;
    name: string;
    display_name?: string;
    username?: string;
    avatar?: string;
    avatar_type: 'google' | 'preset';
    avatar_preset?: string;
    bio?: string;
    is_admin: boolean;
    created_at?: string;
    submission_count: number;
    approved_count: number;
}

export interface UserPublic {
    id: number;
    display_name?: string;
    name: string;
    avatar?: string;
    avatar_type: 'google' | 'preset';
    avatar_preset?: string;
    username?: string;
}

export interface PresetAvatar {
    id: string;
    label: string;
    emoji: string;
}

export interface LikeResponse {
    liked: boolean;
    like_count: number;
}

export interface UserSubmission {
    id: number;
    title: string;
    title_roman?: string;
    poet_name?: string;
    poet_name_roman?: string;
    status: string;
    url_slug?: string;
    has_pending_submission: boolean;
}

export interface LikedPoemSummary {
    id: number;
    title: string;
    title_roman?: string;
    poet_name?: string;
    poet_name_roman?: string;
    url_slug?: string;
    liked_at?: string;
}

/** Optional contact/social links, editable by admin on both poets and poems. */
export interface LinkFields {
    instagram_url?: string | null;
    youtube_url?: string | null;
    contact_email?: string | null;
    website_url?: string | null;
}

export interface PoetOut extends LinkFields {
    date_of_birth?: string | null; // ISO date (YYYY-MM-DD)
    date_of_death?: string | null;
    id: number;
    name: string;
    name_roman?: string;
    bio?: string;
    image_url?: string;
    pet_name?: string;
    genre?: string;
    life_span?: string; // e.g., "1850 – 1920"
    poem_count?: number;
}

export interface PoetMiniOut {
    id: number;
    name: string;
    name_roman?: string;
    image_url?: string | null;
}

export interface PaginatedPoetResponse {
    items: PoetOut[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface PoemOut extends LinkFields {
    id: number;
    title: string;
    title_roman?: string;
    body_marathi: string;
    body_roman?: string;
    body_meaning?: string;
    poet_id: number;
    poet?: PoetOut;
    book_id?: number;
    chhanda_id?: number;
    chhanda_name?: string;
    genre?: string;
    description?: string;
    metadata_json?: any;
    search_slug?: string;
    url_slug?: string;
    status: 'draft' | 'pending' | 'tokenized' | 'approved';
    words: WordOut[];
    tags?: TagOut[];
    contributed_by?: UserPublic;
    like_count: number;
    is_liked?: boolean;
}

export interface TagOut {
    id: number;
    name: string;
    slug: string;
    is_category: boolean;
}

export interface TagWithCount extends TagOut {
    poem_count: number;
}

/** Lightweight poem card from GET /api/poems/random */
export interface PoemSuggestion {
    id: number;
    title: string;
    title_roman?: string;
    url_slug?: string;
    poet?: PoetMiniOut;
}

/** A fuzzy poet match from GET /api/poets/suggest ("did you mean…"). */
export interface PoetSuggestion {
    id: number;
    name: string;
    name_roman?: string | null;
    poem_count: number;
    exact: boolean;
    score: number;
}

export interface PoetSearchResponse {
    results: PoetOut[];
}

// Matches the backend's PaginatedPoetResponse (app/schemas/poet.py).
// GET /api/poets/ returns this envelope, not a bare PoetOut[].
export interface PaginatedPoetResponse {
    items: PoetOut[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user?: UserProfile;
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
