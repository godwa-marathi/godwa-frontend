"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

/**
 * Client-side convenience guard for admin pages. NOT a security boundary: the API
 * enforces admin rights; this only avoids showing broken admin screens to others.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const allowed = !!user?.is_admin;

    React.useEffect(() => {
        if (isLoading) return;
        if (!token) router.replace("/auth/login?redirect=/admin");
        else if (!allowed) router.replace("/");
    }, [isLoading, token, allowed, router]);

    if (isLoading || !allowed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-label="Checking access">
                <Loader2 className="w-8 h-8 text-maroon animate-spin" />
            </div>
        );
    }
    return <>{children}</>;
}
