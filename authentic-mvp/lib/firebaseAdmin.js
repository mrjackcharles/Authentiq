import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function resolveEnv(key) {
    const direct = process.env[key];
    if (direct) return direct;

    const secretsRaw = process.env.secrets;
    if (typeof secretsRaw !== "string" || !secretsRaw) return undefined;

    try {
        const secrets = JSON.parse(secretsRaw);
        if (secrets && typeof secrets === "object") {
            const value = secrets[key];
            if (value) return value;
        }
    } catch (err) {
        console.error("Failed to parse process.env.secrets", err);
    }

    return undefined;
}

// Initialize Firebase Admin SDK once per server instance
export function getAdminDb() {
    if (!getApps().length) {
        const projectId = resolveEnv("FIREBASE_PROJECT_ID");
        const clientEmail = resolveEnv("FIREBASE_CLIENT_EMAIL");
        const privateKeyRaw = resolveEnv("FIREBASE_PRIVATE_KEY");

        console.log("Admin env diag", {
            awsBranch: process.env.AWS_BRANCH,
            secretsType: typeof process.env.secrets,
            secretsLength:
                typeof process.env.secrets === "string"
                    ? process.env.secrets.length
                    : 0,
            hasProjectId: Boolean(process.env.FIREBASE_PROJECT_ID),
        });

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
