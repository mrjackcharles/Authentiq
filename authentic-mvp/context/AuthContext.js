import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const AuthContext = createContext({
    user: null,
    initializing: true,
    logout: async () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setInitializing(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Failed to sign out", err);
        }
    };

    const value = useMemo(
        () => ({
            user,
            initializing,
            logout,
        }),
        [user, initializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
