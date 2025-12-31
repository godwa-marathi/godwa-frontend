import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function splitMarathiText(text: string) {
    // Split by whitespace and punctuation while keeping them
    return text.split(/(\s+|[^\u0900-\u097F\w])/g).filter(Boolean);
}
