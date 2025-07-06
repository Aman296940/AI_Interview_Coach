import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("SDE");
  const [level, setLevel] = useState("medium");
  const [loading, setLoading] = useState(false);

   const handleStart = async () => {
    try {
      setLoading(true);
      
      // Make API call to create interview
      const token = localStorage.getItem('token'); // Assuming JWT auth
      const response = await axios.post('/api/interview/start-interview', {
        type: role,
        difficulty: level
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Navigate only after successful API call
      navigate(`/interview?role=${role}&level=${level}&interviewId=${response.data.interviewId}`);
      
    } catch (error) {
      console.error('Failed to start interview:', error);
      // Handle error (show toast, alert, etc.)
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Setup Your Interview</h2>

      <div className="mb-4">
        <label className="block mb-1">Select Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="SDE">SDE</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Select Difficulty</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button 
        onClick={handleStart} 
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Starting...' : 'Start Interview'}
      </button>
    </div>
  );
}
