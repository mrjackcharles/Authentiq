import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#121212] text-[#f5f5f4]">
            <Navbar />
            <main className="mx-auto max-w-4xl p-6">{children}</main>
        </div>
    );
}
