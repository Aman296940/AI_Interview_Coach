// client/src/components/Dashboard/Stats.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function PerformanceChart({ data }) {
  return (
    <div className="performance-chart">
      <h3>Performance Over Time</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Line type="monotone" dataKey="score" stroke="#2196f3" />
      </LineChart>
    </div>
  );
}
