// next.config.js (ESM)

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "standalone", // ship a Node bundle for Amplify SSR
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
    trailingSlash: false,

    // Keep deploys unblocked by CI lint/TS
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },

    // If you use next/image and don't have your own loader, avoid image lambda paths
    images: {
        unoptimized: true,
        domains: [
            "ipfs.io",
            "firebaseapp.com",
            "firebasestorage.googleapis.com",
            "firebasestorage.app",
            // 'authentiq.uk', // add your own hosts if you display images from them
        ],
    },

    experimental: {
        typedRoutes: true,
        serverActions: false, // only enable if you’ve verified them on your runtime
        instrumentationHook: true, // optional tracing via /instrumentation.ts
    },

    async headers() {
        // light security headers that won’t break things
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
