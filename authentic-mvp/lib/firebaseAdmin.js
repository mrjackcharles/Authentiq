import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const secretCache = new Map();
const ssmRegion = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
const ssmClient = new SSMClient({ region: ssmRegion });

const buildSsmPrefix = () => {
    if (process.env.AMPLIFY_SSM_PREFIX) return process.env.AMPLIFY_SSM_PREFIX.endsWith("/")
        ? process.env.AMPLIFY_SSM_PREFIX
        : `${process.env.AMPLIFY_SSM_PREFIX}/`;

    const appId = process.env.AMPLIFY_APP_ID || process.env.AWS_APP_ID || "d2kl2f96ivxs2w";
    const branch = process.env.AWS_BRANCH || "main";
    return `/amplify/${appId}/${branch}/`;
};

const ssmPrefix = buildSsmPrefix();

async function resolveEnv(key) {
    const direct = process.env[key];
    if (direct) return direct;

    if (secretCache.has(key)) return secretCache.get(key);

    const secretsRaw = process.env.secrets;
    if (typeof secretsRaw === "string" && secretsRaw.length > 0) {
        try {
            const secrets = JSON.parse(secretsRaw);
            const value = secrets?.[key];
            if (value) {
                secretCache.set(key, value);
                return value;
            }
        } catch (err) {
            console.error("Failed to parse process.env.secrets", err);
        }
    }

    try {
        const resp = await ssmClient.send(
            new GetParameterCommand({
                Name: `${ssmPrefix}${key}`,
                WithDecryption: true,
            })
        );
        const value = resp?.Parameter?.Value;
        if (value) {
            secretCache.set(key, value);
            return value;
        }
    } catch (err) {
        console.error(`Failed to fetch ${key} from SSM`, err);
    }

    return undefined;
}

let firestorePromise = null;

async function initFirestore() {
    const [projectId, clientEmail, privateKeyRaw] = await Promise.all([
        resolveEnv("FIREBASE_PROJECT_ID"),
        resolveEnv("FIREBASE_CLIENT_EMAIL"),
        resolveEnv("FIREBASE_PRIVATE_KEY"),
    ]);

    if (!projectId || !clientEmail || !privateKeyRaw) {
        throw new Error(
            "Missing Firebase Admin env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
        );
    }

    if (!getApps().length) {
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

export function getAdminDb() {
    if (!firestorePromise) {
        firestorePromise = initFirestore();
    }
    return firestorePromise;
}
