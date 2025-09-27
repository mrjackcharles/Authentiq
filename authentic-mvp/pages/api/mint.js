import { getServerSdk } from "@/lib/serverSdk";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { name, description, serial, imageUrl } = req.body;

        const sdk = getServerSdk();
        const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS);

        const metadata = {
            name,
            description,
            image: imageUrl,
            attributes: [{ trait_type: "Serial", value: serial }],
        };

        const tx = await contract.erc721.mint(metadata);

        // Need to get rid of one of the if's and find out if it's tx.id or tx.tokenId
        let tokenId;
        if (tx.id !== undefined) tokenId = tx.id.toString();
        else if (tx.tokenId !== undefined) tokenId = tx.tokenId.toString();
        else throw new Error("No tokenId in mint transaction");

        res.status(200).json({ tokenId });
    } catch (err) {
        console.error("Mint failed:", err);
        res.status(500).json({ error: err.message });
    }
}
