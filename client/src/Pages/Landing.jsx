// client/src/Pages/Landing.jsx
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-[#0f172a] text-white min-h-screen font-sans relative overflow-hidden">
      {/* Hero */}
      <main className="text-center px-6 pt-20 pb-16 relative z-10">
        {/* Gradient or visual effect placeholder */}
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="w-[300px] h-[300px] bg-purple-700 opacity-20 blur-[100px] rounded-full" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Intelligent Coach for <br /> Technical Interviews.
        </h1>
        <p className="mt-6 text-gray-300 text-lg">
          Prepare Your Interview With Real Time Feedback.
        </p>
        <Link to="/login">
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded text-white mt-10">
            Get Started
          </button>
        </Link>
      </main>
    </div>
  );
}
