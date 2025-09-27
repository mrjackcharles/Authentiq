import { getServerSdk } from "@/lib/serverSdk";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { name, description, serial, imageUrl, imageBase64 } = req.body;

        const sdk = getServerSdk();
        const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS);

        const metadata = {
            name,
            description,
            attributes: [{ trait_type: "Serial", value: serial }],
        };

        if (imageUrl) {
            metadata.image = imageUrl;
        } else if (imageBase64) {
            // Pass a Buffer so the SDK uploads it to storage
            metadata.image = Buffer.from(imageBase64, "base64");
        }

        const tx = await contract.erc721.mint(metadata);

        // Need to get rid of one of the if's and find out if it's tx.id or tx.tokenId
        let tokenId;
        if (tx.id !== undefined) tokenId = tx.id.toString();
        else if (tx.tokenId !== undefined) tokenId = tx.tokenId.toString();
        else throw new Error("No tokenId in mint transaction");

        // Persist minted item in Firestore
        try {
            const db = getAdminDb();
            const now = new Date().toISOString();
            const txHash = tx?.receipt?.transactionHash || null;

            await db.collection("mintedItems").doc(tokenId).set({
                tokenId,
                contractAddress: process.env.CONTRACT_ADDRESS || null,
                name,
                description,
                imageUrl,
                serial,
                txHash,
                mintedAt: now,
                // raw metadata for reference/debugging
                metadata,
            });
        } catch (persistErr) {
            console.error("Persist to Firestore failed:", persistErr);
            // Do not fail mint response if persistence fails
        }

        res.status(200).json({ tokenId });
    } catch (err) {
        console.error("Mint failed:", err);
        res.status(500).json({ error: err.message });
    }
}
