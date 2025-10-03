import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useAuth } from "@/context/AuthContext";

const MODES = {
    login: {
        heading: "Log in",
        action: signInWithEmailAndPassword,
        cta: "Log in",
        toggle: "Need an account? Create one",
        nextMode: "signup",
    },
    signup: {
        heading: "Create account",
        action: createUserWithEmailAndPassword,
        cta: "Sign up",
        toggle: "Already have an account? Log in",
        nextMode: "login",
    },
};

export default function Login() {
    const router = useRouter();
    const { user, initializing } = useAuth();
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!initializing && user) {
            router.replace("/dashboard");
        }
    }, [initializing, user, router]);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (submitting) return;

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        if (!trimmedEmail || !trimmedPassword) {
            setError("Enter both email and password");
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            const { action } = MODES[mode];
            await action(auth, trimmedEmail, trimmedPassword);
            router.replace("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err?.message || "Authentication failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (!initializing && user) {
        return (
            <div className="space-y-4">
                <p className="text-gray-700">You are already signed in as {user.email}.</p>
                <button
                    type="button"
                    className="font-medium text-[#5b21b6] underline"
                    onClick={() => router.push("/dashboard")}
                >
                    Go to dashboard
                </button>
            </div>
        );
    }

    const { heading, cta, toggle, nextMode } = MODES[mode];

    return (
        <div className="mx-auto max-w-md rounded bg-white p-6 shadow">
            <h1 className="mb-4 text-2xl font-semibold text-[#4c1d95]">{heading}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="block text-sm font-medium text-gray-700">Email</span>
                    <input
                        className="mt-1 w-full rounded border border-[#d9d2ff] p-2 focus:border-[#7c3aed] focus:outline-none"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                        required
                    />
                </label>
                <label className="block">
                    <span className="block text-sm font-medium text-gray-700">Password</span>
                    <input
                        className="mt-1 w-full rounded border border-[#d9d2ff] p-2 focus:border-[#7c3aed] focus:outline-none"
                        placeholder="Enter a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        required
                    />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    className="w-full rounded bg-[#5b21b6] px-4 py-2 font-semibold text-white transition hover:bg-[#4c1d95] disabled:opacity-70"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? "Please wait…" : cta}
                </button>
            </form>
            <button
                type="button"
                className="mt-4 text-sm font-medium text-[#7c3aed] hover:text-[#5b21b6]"
                onClick={() => setMode(nextMode)}
            >
                {toggle}
            </button>
        </div>
    );
}
