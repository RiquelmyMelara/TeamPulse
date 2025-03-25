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
        <div>
            <h2>Team Check-Ins</h2>
            {checkIns.length === 0 && <p>No check-ins found.</p>}
            <ul>
                {checkIns.map((checkIn) => (
                    <li key={checkIn.id}>
                        <strong>{checkIn.user.name}</strong> – {emojiForMood(checkIn.mood)}<br />
                        <span>{checkIn.tasksCompleted}</span>
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