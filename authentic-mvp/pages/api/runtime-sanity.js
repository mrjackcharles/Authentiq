// Force Node runtime
export const config = { runtime: "nodejs" };

import { getAdminEnvStatus } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
    // never cache this
    res.setHeader("Cache-Control", "no-store, max-age=0");

    if (req.method !== "GET") return res.status(405).end();

    try {
        const status = await getAdminEnvStatus();
        const ok = Object.values(status).every(Boolean);

        res.status(200).json({
            ok,
            status,
            metadata: {
                branch: process.env.AWS_BRANCH || null,
                region:
                    process.env.AWS_REGION ||
                    process.env.AWS_DEFAULT_REGION ||
                    null,
                ssmPrefix: process.env.AMPLIFY_SSM_PREFIX || null,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (err) {
        console.error("Runtime sanity check failed:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
}
