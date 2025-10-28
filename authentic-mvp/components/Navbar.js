import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const router = useRouter();
    const { user, initializing, logout } = useAuth();
    const [busy, setBusy] = useState(false);

    const handleLogout = async () => {
        if (busy) return;
        setBusy(true);
        await logout();
        setBusy(false);
        router.push("/login");
    };

    return (
        <nav className="border-b border-[#27272a] bg-[#1e1e1e] text-[#f5f5f4] shadow">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div className="flex flex-1 items-center gap-6 text-sm font-medium">
                    <Link href="/" className="text-[#d6d3d1] transition hover:text-[#f5f5f4]">
                        Home
                    </Link>
                    {user && !initializing && (
                        <>
                            <Link href="/dashboard" className="text-[#d6d3d1] transition hover:text-[#f5f5f4]">
                                Dashboard
                            </Link>
                            <Link href="/create" className="text-[#d6d3d1] transition hover:text-[#f5f5f4]">
                                Create
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex justify-center flex-none px-4">
                    <Link
                        href="/"
                        className="text-base sm:text-lg font-semibold uppercase tracking-[0.35em] text-[#f5f5f4]"
                    >
                        Authentiq
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end gap-3 text-sm">
                    {initializing ? null : user ? (
                        <>
                            <span className="rounded-full bg-[#27272a] px-3 py-1 text-[#d6d3d1]">
                                {user.email}
                            </span>
                            <button
                                type="button"
                                className="rounded-full bg-[#bfa181] px-4 py-2 font-medium text-[#121212] transition hover:bg-[#e1c16e] disabled:opacity-70"
                                onClick={handleLogout}
                                disabled={busy}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-[#bfa181] px-4 py-2 font-semibold text-[#121212] shadow hover:bg-[#e1c16e]"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
