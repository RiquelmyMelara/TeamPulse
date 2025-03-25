import Navbar from "./Navbar";

export default function Header() {
    return (
        <header className="bg-blue-600 text-white p-4 shadow">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-semibold">TeamPulse</h1>
                <Navbar />
            </div>
        </header>
    );
}