import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
// Layout is provided globally in pages/_app.js

export default function Create() {
    const router = useRouter();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            let imageUrl = null;
            let imageBase64 = null;
            if (data.image[0]) {
                const file = data.image[0];
                const arrayBuffer = await file.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);
                let binary = "";
                const chunkSize = 0x8000; // 32KB chunks to avoid call stack limits
                for (let i = 0; i < bytes.length; i += chunkSize) {
                    const chunk = bytes.subarray(i, i + chunkSize);
                    binary += String.fromCharCode.apply(null, chunk);
                }
                imageBase64 = btoa(binary);
            }

            const res = await fetch("/api/mint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    serial: data.serial,
                    imageUrl: imageUrl || null, // pre-uploaded URL if available
                    imageBase64, // alternatively, let the server upload via SDK
                }),
            });

            const result = await res.json();
            console.log("Mint API result:", result);

            if (res.ok && result.tokenId) {
                router.push(`/certificate/${result.tokenId}`);
            } else {
                alert("Mint failed: " + result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Mint failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-xl font-semibold text-[#f5f5f4]">Create Certificate</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <input
                    {...register("name")}
                    placeholder="Product Name"
                    className="w-full rounded border border-[#27272a] bg-[#1e1e1e] p-2 text-[#f5f5f4] placeholder:text-[#8e8e8e] focus:border-[#bfa181] focus:outline-none focus:ring-2 focus:ring-[#bfa181]"
                />
                <input
                    {...register("serial")}
                    placeholder="Serial Number"
                    className="w-full rounded border border-[#27272a] bg-[#1e1e1e] p-2 text-[#f5f5f4] placeholder:text-[#8e8e8e] focus:border-[#bfa181] focus:outline-none focus:ring-2 focus:ring-[#bfa181]"
                />
                <textarea
                    {...register("description")}
                    placeholder="Description"
                    className="w-full rounded border border-[#27272a] bg-[#1e1e1e] p-2 text-[#f5f5f4] placeholder:text-[#8e8e8e] focus:border-[#bfa181] focus:outline-none focus:ring-2 focus:ring-[#bfa181]"
                />
                <input type="file" className="text-[#d6d3d1]" {...register("image")} />
                <button
                    type="submit"
                    className="rounded bg-[#bfa181] px-4 py-2 font-semibold text-[#121212] transition hover:bg-[#e1c16e] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Minting..." : "Mint"}
                </button>
            </form>
        </>
    );
}
