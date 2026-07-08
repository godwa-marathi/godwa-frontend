import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom doesn't implement matchMedia; framer-motion touches it during render.
if (typeof window !== "undefined" && !window.matchMedia) {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
            return false;
        },
    })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
    cleanup();
});
