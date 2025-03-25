import { useEffect, useState } from 'react';
import axios from 'axios';

interface CheckIn {
    id: string;
    mood: string;
    tasksCompleted: string;
    blockers: string | null;
    createdAt: string;
}

export default function Dashboard() {
    const [form, setForm] = useState({
        mood: '',
        tasksCompleted: '',
        blockers: '',
    });

    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            alert("You must log in first.");
            return;
        }
        setToken(savedToken);
        fetchCheckIns(savedToken);
    }, []);

    const fetchCheckIns = async (jwt: string) => {
        try {
            const response = await axios.get('/api/check-ins', {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            setCheckIns(response.data);
        } catch (err) {
            console.error(err);
            alert('Error fetching check-ins');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            await axios.post('/api/check-ins', form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setForm({ mood: '', tasksCompleted: '', blockers: '' });
            fetchCheckIns(token);
        } catch (err) {
            console.error(err);
            alert('Failed to submit check-in');
        }
    };

    return (
        <div>
            <h2>Submit Check-In</h2>
            <form onSubmit={handleSubmit}>
                <select name="mood" value={form.mood} onChange={handleChange} required>
                    <option value="">Select mood</option>
                    <option value="happy">😊 Happy</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="frustrated">😤 Frustrated</option>
                </select>
                <textarea
                    name="tasksCompleted"
                    placeholder="What did you accomplish today?"
                    value={form.tasksCompleted}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="blockers"
                    placeholder="Any blockers?"
                    value={form.blockers}
                    onChange={handleChange}
                />
                <button type="submit">Check In</button>
            </form>

            <h3>Your Recent Check-Ins</h3>
            <ul>
                {checkIns.map((checkIn) => (
                    <li key={checkIn.id}>
                        <strong>{emojiForMood(checkIn.mood)}</strong> – {checkIn.tasksCompleted}
                        {checkIn.blockers && <em> (Blockers: {checkIn.blockers})</em>}<br />
                            <small>{new Date(checkIn.createdAt).toLocaleString()}</small>
                            </li>
                            ))}
                    </ul>
                    </div>
                    );
                }

function emojiForMood(mood: string) {
    switch (mood) {
        case 'happy': return '😊';
        case 'neutral': return '😐';
        case 'frustrated': return '😤';
        default: return '❓';
    }
}