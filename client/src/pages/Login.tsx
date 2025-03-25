import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('/api/auth/login', form);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/dashboard';
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                >
                    Login
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Don’t have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}