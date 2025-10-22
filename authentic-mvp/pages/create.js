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
            <h1 className="text-xl font-semibold text-[#004834]">Create Certificate</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <input
                    {...register("name")}
                    placeholder="Product Name"
                    className="w-full rounded border border-[#c6ece0] p-2 focus:border-[#0c7a5a] focus:outline-none"
                />
                <input
                    {...register("serial")}
                    placeholder="Serial Number"
                    className="w-full rounded border border-[#c6ece0] p-2 focus:border-[#0c7a5a] focus:outline-none"
                />
                <textarea
                    {...register("description")}
                    placeholder="Description"
                    className="w-full rounded border border-[#c6ece0] p-2 focus:border-[#0c7a5a] focus:outline-none"
                />
                <input type="file" {...register("image")} />
                <button
                    type="submit"
                    className="rounded bg-[#005d43] px-4 py-2 font-semibold text-white hover:bg-[#004834] disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Minting..." : "Mint"}
                </button>
            </form>
        </>
    );
}
