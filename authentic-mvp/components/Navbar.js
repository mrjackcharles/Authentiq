import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-white shadow p-4 flex space-x-4 text-black">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/create">Create</Link>
        </nav>
    );
}
