import "@/styles/globals.css"; // Tailwind styles
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { initAnalytics } from "@/lib/firebaseClient";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const PUBLIC_ROUTES = new Set(["/", "/login", "/_error"]);

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Initialize Firebase Analytics in the browser (no-op on server)
        initAnalytics();
    }, []);

    return (
        <AuthProvider>
            <AppContent Component={Component} pageProps={pageProps} />
        </AuthProvider>
    );
}

function AppContent({ Component, pageProps }) {
    const router = useRouter();
    const { user, initializing } = useAuth();
    const path = router.pathname ?? "";
    const isPublic = PUBLIC_ROUTES.has(path);

    useEffect(() => {
        if (!initializing && !user && !isPublic) {
            router.replace("/login");
        }
    }, [initializing, user, isPublic, router]);

    if (!isPublic && (initializing || !user)) {
        return (
            <Layout>
                <div className="py-12 text-center text-[#d6d3d1]">Checking credentials…</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
