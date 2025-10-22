import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
// Layout is provided globally in pages/_app.js

export default function Certificate() {
    const router = useRouter();
    const { id } = router.query;
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [minted, setMinted] = useState(null);
    const [pageUrl, setPageUrl] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchAll = async () => {
            try {
                const [nftRes, mintedRes] = await Promise.all([
                    fetch(`/api/get-certificate/${id}`),
                    fetch(`/api/minted/${id}`),
                ]);

                const nft = await nftRes.json();
                setMetadata(nft);

                const mintedJson = await mintedRes.json();
                setMinted(mintedJson?.found ? mintedJson : null);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPageUrl(window.location.origin + router.asPath);
        }
    }, [router.asPath]);

    if (loading) return <>Loading...</>;
    if (!metadata) return <>Certificate not found</>;

    const serial = metadata.attributes?.find?.(
        (attr) => attr.trait_type === "Serial"
    )?.value;

    const tokenId = router.query.id;
    const contractAddress = minted?.contractAddress || null;
    const explorerBase = "https://amoy.polygonscan.com";
    const tokenExplorerUrl =
        contractAddress && tokenId
            ? `${explorerBase}/token/${contractAddress}?a=${tokenId}`
            : null;
    const txExplorerUrl = minted?.txHash
        ? `${explorerBase}/tx/${minted.txHash}`
        : null;

    const displayImage =
        typeof metadata.image === "string" && metadata.image.startsWith("ipfs://")
            ? `https://ipfs.io/ipfs/${metadata.image.slice(7)}`
            : metadata.image;

    return (
        <div className="mx-auto max-w-3xl">
            <div className="bg-white shadow-xl rounded-lg border p-6 md:p-10">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wide">
                        Certificate of Authenticity
                    </h1>
                    <p className="text-gray-500 mt-1">Authentiq</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-2">
                        {displayImage ? (
                            <div className="aspect-[4/3] w-full overflow-hidden rounded border bg-gray-50">
                                <img
                                    src={displayImage}
                                    alt={metadata.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="aspect-[4/3] w-full rounded border bg-gray-50" />
                        )}
                    </div>
                    <div className="md:col-span-1">
                        {pageUrl ? (
                            <div className="flex flex-col items-center">
                                <QRCodeSVG value={pageUrl} size={160} includeMargin />
                                <p className="text-xs text-gray-500 mt-2 break-all text-center">
                                    {pageUrl}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-semibold">{metadata.name}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Serial</div>
                        <div className="font-mono">{serial ?? "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Token ID</div>
                        <div className="font-mono">{tokenId}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Network</div>
                        <div>Polygon Amoy</div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="text-sm text-gray-500">Description</div>
                        <div>{metadata.description || "-"}</div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                    {contractAddress && (
                        <a
                            className="text-sm font-medium text-[#005d43] hover:text-[#004834] hover:underline"
                            href={tokenExplorerUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View on Polygonscan
                        </a>
                    )}
                    {txExplorerUrl && (
                        <a
                            className="text-sm font-medium text-[#005d43] hover:text-[#004834] hover:underline"
                            href={txExplorerUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View mint transaction
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={() => typeof window !== "undefined" && window.print()}
                        className="ml-auto rounded bg-[#005d43] px-3 py-2 text-sm font-semibold text-white hover:bg-[#004834]"
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
}
