import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', form);
            alert(`Welcome back, token: ${response.data.token}`);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            alert('Login failed');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input name="email" placeholder="Email" onChange={handleChange}/>
            <input name="password" type="password" placeholder="Password" onChange={handleChange}/>
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </form>
    );
}