import "@/styles/globals.css"; // Tailwind styles
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebaseClient";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Initialize Firebase Analytics in the browser (no-op on server)
        initAnalytics();
    }, []);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
