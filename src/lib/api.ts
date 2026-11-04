import Cookies from 'js-cookie';

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://iampratham29-godwa-backend.hf.space';
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = Cookies.get('godwa_access_token');

    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorMessage(errorData, `HTTP error! status: ${response.status}`));
    }

    return response.json();
}

/** FastAPI sends `detail` as a string, or as a list of {msg, loc} for 422 validation errors. */
export function errorMessage(errorData: any, fallback: string): string {
    const detail = errorData?.detail;
    if (typeof detail === 'string' && detail) return detail;
    if (Array.isArray(detail) && detail.length) {
        return detail
            .map((d: any) => (d?.msg ? String(d.msg).replace(/^Value error, /, '') : String(d)))
            .join('; ');
    }
    return fallback;
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
    postFormData: <T>(endpoint: string, formData: FormData) => {
        const token = Cookies.get('godwa_access_token');
        const headers = new Headers();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        // Content-Type is set automatically for FormData
        return fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        }).then(async (res) => {
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorMessage(errorData, `HTTP error! status: ${res.status}`));
            }
            return res.json() as Promise<T>;
        });
    },
};

