import { getAdminDb } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing id" });

  if (req.method !== "GET") return res.status(405).end();

  try {
    const db = await getAdminDb();
    const doc = await db.collection("mintedItems").doc(String(id)).get();
    res.setHeader("Cache-Control", "no-store");

    if (!doc.exists) return res.status(200).json({ found: false });

    const data = doc.data() || {};
    return res.status(200).json({
      found: true,
      tokenId: data.tokenId ?? doc.id,
      name: data.name ?? null,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? data.metadata?.image ?? null,
      serial:
        data.serial ??
        data.metadata?.attributes?.find?.((a) => a?.trait_type === "Serial")?.value ?? null,
      txHash: data.txHash ?? null,
      mintedAt: typeof data.mintedAt === "string" ? data.mintedAt : null,
      contractAddress: data.contractAddress ?? null,
    });
  } catch (err) {
    console.error("Fetch minted item failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
