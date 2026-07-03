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
    status: 'draft' | 'pending' | 'approved';
    words: WordOut[];
    contributed_by?: UserPublic;
    like_count: number;
    is_liked?: boolean;
}

export interface PoetSearchResponse {
    results: PoetOut[];
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
