// src/components/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 p-4 text-center mt-12">
            <p className="text-sm">&copy; {new Date().getFullYear()} TeamPulse. All rights reserved.</p>
        </footer>
    );
}