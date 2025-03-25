import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {JSX} from "react";

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Optional: auto-logout if token is expired
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        return children;
    } catch (err) {
        return <Navigate to="/login" />;
    }
}