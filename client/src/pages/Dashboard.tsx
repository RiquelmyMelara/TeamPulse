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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            setError("You must log in first.");
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
            setError('Error fetching check-ins.');
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
            setError(null); // clear error on success
            fetchCheckIns(token);
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to submit check-in.');
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Submit Check-In</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block mb-1 font-medium">Mood</label>
                    <select
                        name="mood"
                        value={form.mood}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select mood</option>
                        <option value="happy">😊 Happy</option>
                        <option value="neutral">😐 Neutral</option>
                        <option value="frustrated">😤 Frustrated</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Tasks Completed</label>
                    <textarea
                        name="tasksCompleted"
                        placeholder="What did you accomplish today?"
                        value={form.tasksCompleted}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Blockers</label>
                    <textarea
                        name="blockers"
                        placeholder="Any blockers?"
                        value={form.blockers}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                    Check In
                </button>
            </form>

            <h3 className="text-xl font-semibold mt-8 mb-2">Your Recent Check-Ins</h3>
            <ul className="space-y-4">
                {checkIns.map((checkIn) => (
                    <li key={checkIn.id} className="bg-white p-4 rounded shadow">
                        <div>
                            <strong>{emojiForMood(checkIn.mood)}</strong> – {checkIn.tasksCompleted}
                            {checkIn.blockers && (
                                <em className="block text-sm text-red-600 mt-1">
                                    Blockers: {checkIn.blockers}
                                </em>
                            )}
                        </div>
                        <small className="text-gray-500">{new Date(checkIn.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function emojiForMood(mood: string) {
    switch (mood) {
        case 'happy':
            return '😊';
        case 'neutral':
            return '😐';
        case 'frustrated':
            return '😤';
        default:
            return '❓';
    }
}