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
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            setIsAdmin(decoded.role === 'admin');
        } catch (err) {
            console.error('Invalid token');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <Link to="/dashboard">Dashboard</Link>
            {isAdmin && <Link to="/team-dashboard">Team Dashboard</Link>}
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}