import Link from "next/link";
import { getAdminDb } from "@/lib/firebaseAdmin";

export default function Dashboard({ items = [], error = null }) {
    return (
        <div>
            <h1 className="text-xl font-bold">Minted Certificates</h1>
            {error && (
                <p className="text-red-600 mt-2">Failed to load: {error}</p>
            )}
            {items.length === 0 ? (
                <p className="text-gray-600 mt-3">No items minted yet.</p>
            ) : (
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((it) => {
                        const src =
                            typeof it.imageUrl === "string" && it.imageUrl.startsWith("ipfs://")
                                ? `https://ipfs.io/ipfs/${it.imageUrl.slice(7)}`
                                : it.imageUrl;
                        return (
                        <li key={it.tokenId} className="bg-white shadow p-4 rounded">
                            <div className="flex items-start gap-4">
                                {src ? (
                                    <img
                                        src={src}
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
                                            className="text-blue-600 hover:underline text-sm"
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

        const items = snap.docs.map((d) => {
            const data = d.data() || {};
            return {
                tokenId: data.tokenId ?? d.id,
                name: data.name ?? null,
                description: data.description ?? null,
                imageUrl: data.imageUrl ?? data.metadata?.image ?? null,
                serial: data.serial ?? data.metadata?.attributes?.find?.((a) => a?.trait_type === "Serial")?.value ?? null,
                // mintedAt is already stored as ISO string; passing through avoids client-side formatting
                mintedAt: typeof data.mintedAt === "string" ? data.mintedAt : null,
            };
        });

        return { props: { items } };
    } catch (e) {
        return { props: { items: [], error: e.message || "Unknown error" } };
    }
}
