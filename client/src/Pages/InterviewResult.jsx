import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Services/api";

export default function InterviewResult() {
  const { id } = useParams();          // interviewId from URL
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/interview/${id}`);
        setData(res.data);
      } catch (e) {
        console.error("Failed to fetch interview:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6">Interview not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Interview Summary</h2>

      <div className="p-4 bg-blue-50 rounded shadow">
        <p className="text-xl font-bold text-blue-700">
          Final Score: {data.finalScore ?? "N/A"}/100
        </p>
        <p className="text-sm text-gray-700">
          Answered {data.sessions.length} questions &nbsp;|&nbsp; Difficulty:{" "}
          {data.difficulty}
        </p>
      </div>

      <h3 className="text-lg font-semibold mt-6">Per‑question feedback</h3>
      <ul className="space-y-4">
        {data.sessions.map((s, i) => (
          <li key={i} className="border rounded p-4">
            <p className="font-semibold mb-1">Q{i + 1}: {s.question}</p>
            <p className="mb-1"><strong>Your Answer:</strong> {s.answer}</p>
            <p className="mb-1"><strong>Score:</strong> {s.score}/100 &nbsp;|&nbsp; <strong>Confidence:</strong> {s.confidence}/100</p>
            <p className="mb-1"><strong>Feedback:</strong> {s.feedback}</p>
            {s.suggestedAnswer !== "N/A" && (
              <p className="mb-1"><strong>Better Answer:</strong> {s.suggestedAnswer}</p>
            )}
            {s.topic !== "N/A" && (
              <p><strong>Topic to Study:</strong> {s.topic}</p>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-8 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
