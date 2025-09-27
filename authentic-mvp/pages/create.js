import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Create() {
    const router = useRouter();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            let imageUrl = "";
            if (data.image[0]) {
                const formData = new FormData();
                formData.append("file", data.image[0]);

                const uploadRes = await fetch(
                    "https://api.thirdweb.com/v1/storage/upload",
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_THIRDWEB_API_KEY}`,
                        },
                    }
                );

                const uploadJson = await uploadRes.json();
                imageUrl = uploadJson.uri;
            }

            const res = await fetch("/api/mint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    serial: data.serial,
                    imageUrl,
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
        <Layout>
            <h1 className="text-xl font-bold">Create Certificate</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <input
                    {...register("name")}
                    placeholder="Product Name"
                    className="border p-2 w-full"
                />
                <input
                    {...register("serial")}
                    placeholder="Serial Number"
                    className="border p-2 w-full"
                />
                <textarea
                    {...register("description")}
                    placeholder="Description"
                    className="border p-2 w-full"
                />
                <input type="file" {...register("image")} />
                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Minting..." : "Mint"}
                </button>
            </form>
        </Layout>
    );
}
