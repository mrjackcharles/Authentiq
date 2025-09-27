import { getServerSdk } from "@/lib/serverSdk";

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const sdk = getServerSdk();
        const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS);
        const nft = await contract.erc721.get(id);

        res.status(200).json(nft.metadata);
    } catch (err) {
        console.error("Fetch NFT failed:", err);
        res.status(500).json({ error: err.message });
    }
}
