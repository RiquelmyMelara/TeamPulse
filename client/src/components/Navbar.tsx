import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: string;
    role: 'user' | 'admin';
    exp: number;
}

export default function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const isExpired = decoded.exp * 1000 < Date.now();

            if (isExpired) {
                localStorage.removeItem('token');
                return;
            }

            setIsLoggedIn(true);
            setIsAdmin(decoded.role === 'admin');
        } catch (err) {
            console.error('Invalid token');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!isLoggedIn) return null;

    return (
        <nav className="shadow-sm py-3 px-6 flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
                <Link to="/dashboard" className="text-white-600 font-medium hover:underline">
                    Dashboard
                </Link>
                {isAdmin && (
                    <Link to="/team-dashboard" className="text-white font-medium hover:underline">
                        Team Dashboard
                    </Link>
                )}
            </div>
            <button
                onClick={handleLogout}
                className="text-white px-3 py-1 hover:underline rounded transition"
            >
                Logout
            </button>
        </nav>
    );
}