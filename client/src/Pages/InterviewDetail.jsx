import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../Services/api';

export default function InterviewDetail() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/interview/${id}`);
        setInterview(data);
      } catch (err) {
        console.error('Error fetching interview:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!interview) return <div className="p-6">Interview not found.</div>;

  // Use 'responses' instead of 'sessions'
  const answers = Array.isArray(interview.responses) ? interview.responses : [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/dashboard" className="text-blue-600">&larr; Back to Dashboard</Link>
      <h2 className="text-2xl font-semibold mt-2 mb-4">Interview Details</h2>

      <p><strong>Date:</strong> {new Date(interview.createdAt).toLocaleString()}</p>
      <p><strong>Type:</strong> {interview.type}</p>
      <p><strong>Difficulty:</strong> {interview.difficulty}</p>
      <hr className="my-4" />

      {answers.length === 0 ? (
        <p>No answers recorded.</p>
      ) : (
        answers.map((s, i) => (
          <div key={i} className="mb-6 p-4 bg-gray-50 border rounded">
            <p><strong>Question {i + 1}:</strong> {s.question}</p>
            <p><strong>Your Answer:</strong> {s.answer}</p>
            <p><strong>AI Feedback:</strong> {s.feedback}</p>
            <p><strong>Score:</strong> {s.score ?? 'N/A'}/10</p>
          </div>
        ))
      )}
    </div>
  );
}
