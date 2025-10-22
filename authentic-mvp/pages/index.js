import Link from "next/link";

const sellingPoints = [
    {
        title: "Tamper-proof provenance",
        description: "Each certificate is recorded on-chain, making it impossible to forge ownership history.",
    },
    {
        title: "Instant buyer confidence",
        description: "Share a QR code or short URL so customers can verify authenticity in seconds on any device.",
    },
    {
        title: "Effortless issuing",
        description: "Mint certificates from your dashboard and attach photos, serials, and metadata tailored to your brand.",
    },
];

const workflow = [
    "Create a certificate with detailed product metadata",
    "Mint a verifiable NFT-backed record on Polygon",
    "Add the QR or URL to packaging, receipts, or after-sales emails",
    "Buyers scan to confirm provenance before they buy",
];

export default function Home() {
    return (
        <div className="space-y-16 py-12">
            <section className="rounded-3xl bg-gradient-to-br from-[#003d2d] via-[#005d43] to-[#0f8c68] text-white p-10 shadow-xl">
                <div className="space-y-6 max-w-2xl">
                    <p className="uppercase tracking-[0.4em] text-xs sm:text-sm text-violet-100">Authenticate Anything</p>
                    <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
                        Stop counterfeits before they reach your customers.
                    </h1>
                    <p className="text-base sm:text-lg text-violet-100/90 leading-relaxed">
                        Authentiq gives every premium item a verifiable digital certificate backed by the blockchain.
                        Prove legitimacy, preserve trust, and protect your brand in a world where copies are everywhere.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 font-semibold text-[#005d43] shadow hover:bg-[#dff5ee]"
                        >
                            Access dashboard
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center justify-center rounded-full border border-white/60 px-5 py-3 font-semibold text-white hover:bg-white/15"
                        >
                            See how it works
                        </a>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900">Why brands trust Authentiq</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {sellingPoints.map((point) => (
                        <div key={point.title} className="rounded-2xl bg-white p-6 shadow-sm border border-[#d8f1e6]">
                            <h3 className="text-lg font-semibold text-[#004834]">{point.title}</h3>
                            <p className="mt-3 text-sm text-[#005d43] leading-relaxed">{point.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="how-it-works" className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">How it works</h2>
                <ol className="space-y-4">
                    {workflow.map((step, index) => (
                        <li key={step} className="flex items-start gap-3">
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#dff5ee] text-[#005d43] font-semibold">
                                {index + 1}
                            </span>
                            <p className="flex-1 text-sm sm:text-base text-[#43303f] leading-relaxed">{step}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="rounded-2xl bg-white border border-[#d8f1e6] p-8 shadow-sm">
                <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-semibold text-[#004834]">Ready to issue your next certificate?</h2>
                    <p className="text-base text-[#005d43] max-w-2xl mx-auto leading-relaxed">
                        Join other luxury brands, collectors, and marketplaces who rely on Authentiq to keep forged goods out of circulation.
                        Start minting certificates in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full bg-[#005d43] px-5 py-3 font-semibold text-white shadow hover:bg-[#004834]"
                        >
                            Sign in to mint
                        </Link>
                        <a
                            href="mailto:hello@authentiq.com"
                            className="inline-flex items-center justify-center rounded-full border border-[#0c7a5a] px-5 py-3 font-semibold text-[#0c7a5a] hover:bg-[#dff5ee]"
                        >
                            Talk to sales
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
