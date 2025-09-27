import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// Layout is provided globally in pages/_app.js

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Logged in!");
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={login} className="space-y-4">
            <input
                className="border p-2 w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="border p-2 w-full"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-black text-white px-4 py-2 rounded" type="submit">
                Login
            </button>
        </form>
    );
}
