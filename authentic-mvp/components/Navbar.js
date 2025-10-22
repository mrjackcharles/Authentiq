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
        <nav className="bg-gradient-to-r from-[#003d2d] via-[#005d43] to-[#0f8c68] text-white shadow">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div className="flex flex-1 items-center gap-6 text-sm font-medium">
                    <Link href="/" className="text-white/85 transition hover:text-white">
                        Home
                    </Link>
                    {user && !initializing && (
                        <>
                            <Link href="/dashboard" className="text-white/85 transition hover:text-white">
                                Dashboard
                            </Link>
                            <Link href="/create" className="text-white/85 transition hover:text-white">
                                Create
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex justify-center flex-none px-4">
                    <Link
                        href="/"
                        className="text-base sm:text-lg font-semibold tracking-[0.35em] uppercase text-white"
                    >
                        Authentiq
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end gap-3 text-sm">
                    {initializing ? null : user ? (
                        <>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-white/85">
                                {user.email}
                            </span>
                            <button
                                type="button"
                                className="rounded-full bg-white/25 px-4 py-2 font-medium text-[#00251b] transition hover:bg-white/40 disabled:opacity-70"
                                onClick={handleLogout}
                                disabled={busy}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-white px-4 py-2 font-semibold text-[#005d43] shadow hover:bg-[#dff5ee]"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
