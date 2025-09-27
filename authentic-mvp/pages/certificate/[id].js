import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function Certificate() {
    const router = useRouter();
    const { id } = router.query;
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchNFT = async () => {
            const res = await fetch(`/api/get-certificate/${id}`);
            const data = await res.json();
            console.log("Certificate API result:", data);
            setMetadata(data);
            setLoading(false);
        };

        fetchNFT();
    }, [id]);

    if (loading) return <Layout>Loading...</Layout>;
    if (!metadata) return <Layout>Certificate not found</Layout>;

    return (
        <Layout>
            <h1 className="text-2xl font-bold">{metadata.name}</h1>
            <p className="mt-2">{metadata.description}</p>
            <p className="mt-1 font-mono">
                Serial:{" "}
                {
                    metadata.attributes?.find(
                        (attr) => attr.trait_type === "Serial"
                    )?.value
                }
            </p>
            {metadata.image && (
                <img
                    src={metadata.image}
                    alt={metadata.name}
                    className="mt-4 max-w-md"
                />
            )}
        </Layout>
    );
}
