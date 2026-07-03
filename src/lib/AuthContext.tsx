"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { AuthResponse, UserProfile } from "@/lib/types";

interface AuthContextType {
    user: UserProfile | null;
    token: string | null;
    isLoading: boolean;
    login: (id_token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    const fetchUserProfile = useCallback(async () => {
        try {
            const profile = await api.get<UserProfile>("/api/users/me");
            setUser(profile);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Token might be invalid — clear it
            Cookies.remove("godwa_access_token");
            setToken(null);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const savedToken = Cookies.get("godwa_access_token");
        if (savedToken) {
            setToken(savedToken);
            fetchUserProfile().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [fetchUserProfile]);

    const login = async (id_token: string) => {
        try {
            const response = await api.post<AuthResponse>("/auth/google", { id_token });
            const { access_token, user: userProfile } = response;
            Cookies.set("godwa_access_token", access_token, { expires: 7 });
            setToken(access_token);
            if (userProfile) {
                setUser(userProfile);
            }
            // Invalidate all queries to refetch with the new token
            queryClient.invalidateQueries();
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove("godwa_access_token");
        setToken(null);
        setUser(null);
        window.location.href = "/";
    };

    const refreshUser = async () => {
        if (token) {
            await fetchUserProfile();
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

