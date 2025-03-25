import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

export default function HomeRedirect() {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }
        return <Navigate to="/dashboard" />;
    } catch (err) {
        return <Navigate to="/login" />;
    }
}