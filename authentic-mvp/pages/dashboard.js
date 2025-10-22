import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getServerSdk } from "@/lib/serverSdk";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard({ items = [], error = null }) {
    const router = useRouter();
    const { user, initializing } = useAuth();

    useEffect(() => {
        if (!initializing && !user) {
            router.replace("/login");
        }
    }, [initializing, user, router]);

    if (initializing || !user) {
        return <p className="text-gray-600">Loading…</p>;
    }

    return (
        <div>
            <h1 className="text-xl font-semibold">Minted Certificates</h1>
            {error && (
                <p className="mt-2 text-[#0c7a5a]">Failed to load: {error}</p>
            )}
            {items.length === 0 ? (
                <p className="text-gray-600 mt-3">No items minted yet.</p>
            ) : (
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((it) => {
                        return (
                        <li key={it.tokenId} className="bg-white shadow p-4 rounded">
                            <div className="flex items-start gap-4">
                                {it.imageUrl ? (
                                    <img
                                        src={it.imageUrl}
                                        alt={it.name || `Token ${it.tokenId}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 rounded" />
                                )}
                                <div className="flex-1">
                                    <h2 className="font-semibold">
                                        {it.name || `Token ${it.tokenId}`}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Token ID: {it.tokenId}
                                    </p>
                                    {it.serial && (
                                        <p className="text-sm text-gray-600">
                                            Serial: {it.serial}
                                        </p>
                                    )}
                                    {it.mintedAt && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Minted: {it.mintedAt}
                                        </p>
                                    )}
                                    <div className="mt-2">
                                        <Link
                                            href={`/certificate/${it.tokenId}`}
                                            className="text-sm font-medium text-[#005d43] hover:text-[#004834] hover:underline"
                                        >
                                            View certificate
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );})}
                </ul>
            )}
        </div>
    );
}

export async function getServerSideProps() {
    try {
        const db = getAdminDb();
        const snap = await db
            .collection("mintedItems")
            .orderBy("mintedAt", "desc")
            .get();

        const normalizeImageUrl = (val) => {
            if (typeof val !== "string") return null;
            const trimmed = val.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("ipfs://")) {
                return `https://ipfs.io/ipfs/${trimmed.slice(7)}`;
            }
            return trimmed;
        };

        const items = snap.docs.map((d) => {
            const data = d.data() || {};
            const resolvedImage =
                normalizeImageUrl(data.imageUrl) ??
                normalizeImageUrl(data.metadata?.image);
            return {
                tokenId: data.tokenId ?? d.id,
                name: data.name ?? null,
                description: data.description ?? null,
                imageUrl: resolvedImage,
                serial: data.serial ?? data.metadata?.attributes?.find?.((a) => a?.trait_type === "Serial")?.value ?? null,
                // mintedAt is already stored as ISO string; passing through avoids client-side formatting
                mintedAt: typeof data.mintedAt === "string" ? data.mintedAt : null,
            };
        });

        const itemsNeedingLookup = items.filter((it) => !it.imageUrl);
        if (itemsNeedingLookup.length > 0) {
            try {
                const sdk = getServerSdk();
                const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS);
                const refreshed = await Promise.all(
                    items.map(async (it) => {
                        if (it.imageUrl) return it;
                        try {
                            const nft = await contract.erc721.get(it.tokenId);
                            const refreshedImage = normalizeImageUrl(nft?.metadata?.image);
                            return {
                                ...it,
                                imageUrl: refreshedImage ?? it.imageUrl,
                            };
                        } catch (err) {
                            console.error("Failed to hydrate metadata for token", it.tokenId, err);
                            return it;
                        }
                    })
                );
                return { props: { items: refreshed } };
            } catch (err) {
                console.error("Metadata refresh failed", err);
            }
        }

        return { props: { items } };
    } catch (e) {
        return { props: { items: [], error: e.message || "Unknown error" } };
    }
}
