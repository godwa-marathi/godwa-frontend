"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { AuthResponse } from "@/lib/types";

interface AuthContextType {
    user: any | null;
    token: string | null;
    isLoading: boolean;
    login: (id_token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = Cookies.get("godwa_access_token");
        if (savedToken) {
            setToken(savedToken);
            // Optional: Fetch user profile here
        }
        setIsLoading(false);
    }, []);

    const login = async (id_token: string) => {
        try {
            const response = await api.post<AuthResponse>("/auth/google", { id_token });
            const { access_token } = response;
            Cookies.set("godwa_access_token", access_token, { expires: 7 });
            setToken(access_token);
            // Optional: Fetch user profile
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

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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
