import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {JSX} from "react";

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

export default function RequireAdmin({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'admin') return <Navigate to="/dashboard" />;
        return children;
    } catch (err) {
        return <Navigate to="/login" />;
    }
}