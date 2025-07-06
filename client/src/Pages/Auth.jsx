// client/src/Pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register" && !formData.agreeTerms) {
      setError("Please agree to the terms.");
      setLoading(false);
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      ...(mode === "register" && { name: formData.name }),
    };

    let result;
    if (mode === "login") {
      result = await login({ email: formData.email, password: formData.password });
    } else {
      result = await register(payload);
    }

    if (result.success) {
      navigate("/setup");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {mode === "login" ? "Sign In" : "Sign Up"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {mode === "register" && (
            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-sm">
                I agree to the <span className="text-blue-600">Terms & Conditions</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
              ? "Sign In"
              : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              type="button"
              onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
              className="text-blue-600 font-medium ml-1"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
