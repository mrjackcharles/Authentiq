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
        <div className="space-y-16 py-12 text-[#d6d3d1]">
            <section className="rounded-3xl border border-[#27272a] bg-gradient-to-br from-[#1e1e1e] via-[#181818] to-[#121212] p-10 text-[#f5f5f4] shadow-xl">
                <div className="max-w-2xl space-y-6">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#d6d3d1] sm:text-sm">Authenticate Anything</p>
                    <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
                        Stop counterfeits before they reach your customers.
                    </h1>
                    <p className="text-base leading-relaxed text-[#d6d3d1] sm:text-lg">
                        Authentiq gives every premium item a verifiable digital certificate backed by the blockchain.
                        Prove legitimacy, preserve trust, and protect your brand in a world where copies are everywhere.
                    </p>
                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full bg-[#bfa181] px-5 py-3 font-semibold text-[#121212] shadow transition hover:bg-[#e1c16e]"
                        >
                            Access dashboard
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center justify-center rounded-full border border-[#bfa181] px-5 py-3 font-semibold text-[#d6d3d1] transition hover:bg-[#27272a] hover:text-[#e1c16e]"
                        >
                            See how it works
                        </a>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-semibold text-[#f5f5f4]">Why brands trust Authentiq</h2>
                <div className="grid gap-6 text-[#d6d3d1] md:grid-cols-3">
                    {sellingPoints.map((point) => (
                        <div key={point.title} className="rounded-2xl border border-[#27272a] bg-[#1e1e1e] p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#f5f5f4]">{point.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#d6d3d1]">{point.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="how-it-works" className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#f5f5f4]">How it works</h2>
                <ol className="space-y-4">
                    {workflow.map((step, index) => (
                        <li key={step} className="flex items-start gap-3 text-[#d6d3d1]">
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#bfa181] bg-[#27272a] font-semibold text-[#f5f5f4]">
                                {index + 1}
                            </span>
                            <p className="flex-1 text-sm leading-relaxed text-[#d6d3d1] sm:text-base">{step}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="rounded-2xl border border-[#27272a] bg-[#1e1e1e] p-8 shadow-sm text-[#d6d3d1]">
                <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-semibold text-[#f5f5f4]">Ready to issue your next certificate?</h2>
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#d6d3d1]">
                        Join other luxury brands, collectors, and marketplaces who rely on Authentiq to keep forged goods out of circulation.
                        Start minting certificates in minutes.
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full bg-[#bfa181] px-5 py-3 font-semibold text-[#121212] shadow transition hover:bg-[#e1c16e]"
                        >
                            Sign in to mint
                        </Link>
                        <a
                            href="mailto:hello@authentiq.com"
                            className="inline-flex items-center justify-center rounded-full border border-[#bfa181] px-5 py-3 font-semibold text-[#d6d3d1] transition hover:bg-[#27272a] hover:text-[#e1c16e]"
                        >
                            Talk to sales
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
