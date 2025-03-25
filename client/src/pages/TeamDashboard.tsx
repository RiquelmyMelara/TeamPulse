import { useEffect, useState } from 'react';
import axios from 'axios';

interface TeamCheckIn {
    id: string;
    mood: string;
    tasksCompleted: string;
    blockers: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export default function TeamDashboard() {
    const [checkIns, setCheckIns] = useState<TeamCheckIn[]>([]);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            alert('You must log in as an admin.');
            return;
        }
        setToken(savedToken);
        fetchTeamCheckIns(savedToken);
    }, []);

    const fetchTeamCheckIns = async (jwt: string) => {
        try {
            const response = await axios.get('/api/check-ins/team', {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            setCheckIns(response.data);
        } catch (err) {
            console.error(err);
            alert('Error fetching team check-ins (maybe not an admin?)');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Check-Ins</h2>
            {checkIns.length === 0 ? (
                <p className="text-gray-500">No check-ins found.</p>
            ) : (
                <ul className="space-y-4">
                    {checkIns.map((checkIn) => (
                        <li
                            key={checkIn.id}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">
                                        {checkIn.user.name} <span className="text-sm text-gray-500">({checkIn.user.email})</span>
                                    </p>
                                </div>
                                <div className="text-2xl">{emojiForMood(checkIn.mood)}</div>
                            </div>
                            <p className="text-gray-800">{checkIn.tasksCompleted}</p>
                            {checkIn.blockers && (
                                <p className="text-sm text-red-600 italic mt-1">
                                    Blockers: {checkIn.blockers}
                                </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(checkIn.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
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