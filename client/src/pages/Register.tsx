import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', form);
            alert('User registered successfully!');
        } catch (err) {
            console.log(err);
            alert('registered failed');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input name="name" placeholder="Name" onChange={handleChange}/>
            <input name="email" placeholder="Email" onChange={handleChange}/>
            <input name="password" type="password" placeholder="Password" onChange={handleChange}/>
            <button type="submit">Register</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
    );
}