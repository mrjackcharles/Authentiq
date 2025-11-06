import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function resolveEnv(key) {
    const direct = process.env[key];
    if (direct) return direct;
    const secrets = process.env?.secrets;
    return secrets ? secrets[key] : undefined;
}

// Initialize Firebase Admin SDK once per server instance
export function getAdminDb() {
    if (!getApps().length) {
        const projectId = resolveEnv("FIREBASE_PROJECT_ID");
        const clientEmail = resolveEnv("FIREBASE_CLIENT_EMAIL");
        const privateKeyRaw = resolveEnv("FIREBASE_PRIVATE_KEY");

        if (!projectId || !clientEmail || !privateKeyRaw) {
            throw new Error(
                "Missing Firebase Admin env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
            );
        }

        // Support multiline keys encoded with \n in .env
        const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

        initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }

    return getFirestore();
}
