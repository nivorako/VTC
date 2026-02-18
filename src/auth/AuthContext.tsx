import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
    _id?: string;
    id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Provider d'authentification.
 *
 * Responsabilités:
 * - Stocker l'utilisateur courant en mémoire (state React)
 * - Persister l'utilisateur dans `localStorage` (si disponible)
 * - Exposer `login` / `logout` via un context React
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        if (typeof window === "undefined") return null;
        try {
            const stored = window.localStorage.getItem("vtc_auth_user");
            return stored ? (JSON.parse(stored) as AuthUser) : null;
        } catch {
            return null;
        }
    });

    /**
     * Connecte l'utilisateur côté client et persiste l'état dans `localStorage`.
     */
    const login = (newUser: AuthUser) => {
        setUser(newUser);
        try {
            window.localStorage.setItem("vtc_auth_user", JSON.stringify(newUser));
        } catch {
            // ignore persistence errors
        }
    };

    /**
     * Déconnecte l'utilisateur côté client et nettoie `localStorage`.
     */
    const logout = () => {
        setUser(null);
        try {
            window.localStorage.removeItem("vtc_auth_user");
        } catch {
            // ignore persistence errors
        }
    };

    useEffect(() => {
        if (user === null) return;
        try {
            window.localStorage.setItem("vtc_auth_user", JSON.stringify(user));
        } catch {
            // ignore persistence errors
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook pour accéder au context d'authentification.
 *
 * @throws {Error} si utilisé en dehors de `AuthProvider`.
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
