import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
    login as loginApi,
    logout as logoutApi,
    authMe as authMeApi
} from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await authMeApi();
                const userData = response.data.user;
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    
    const loginContext = useCallback(async (email, password) => {
        const response = await loginApi({ email, password });
        const newToken = response.data.token;
        const userData = response.data.user;

        localStorage.setItem("token", newToken);
        if (userData) localStorage.setItem("user", JSON.stringify(userData));

        setToken(newToken);
        setUser(userData || null);

        return response;
    }, []);

    
    const loginSuccess = useCallback((newToken, userData) => {
        localStorage.setItem("token", newToken);
        if (userData) localStorage.setItem("user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData || null);
    }, []);


    const updateUser = useCallback((partial) => {
        setUser((prev) => {
            const next = { ...(prev || {}), ...partial };
            localStorage.setItem("user", JSON.stringify(next));
            return next;
        });
    }, []);

    
    const logoutContext = useCallback(async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loading,
                isLoggedIn: !!token,
                isAuthenticated: !!token && !!user,
                loginContext,
                loginSuccess,
                logoutContext,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}


export function useRequireAuth() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return useCallback(
        (action, message = "Please log in first to continue") => {
            if (isLoggedIn) {
                action?.();
                return true;
            }
            toast.error(message);
            navigate("/login", { state: { from: location.pathname } });
            return false;
        },
        [isLoggedIn, navigate, location]
    );
}