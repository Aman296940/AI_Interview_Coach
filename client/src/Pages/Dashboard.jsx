// client/src/Pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/interview/history');
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading your interview history…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Interview History</h2>

      {history.length === 0 ? (
        <p>No interviews yet. Try one now!</p>
      ) : (
        <ul className="space-y-4">
          {history.map((it) => (
            <li key={it._id} className="p-4 border rounded shadow-sm">
              <p>
                <strong>Date:</strong>{' '}
                {new Date(it.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Type:</strong> {it.type || 'N/A'}
              </p>
              <p>
                <strong>Difficulty:</strong> {it.difficulty || 'N/A'}
              </p>

              <button
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => navigate(`/interview/${it._id}`)}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
