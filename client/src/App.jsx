import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider} from "./contexts/AuthContext";
import {useAuth} from "./hooks/useAuth";
import Header from "./Components/Common/Header";
import Landing from "./Pages/Landing";
import InterviewSetup from "./Pages/InterviewSetup";
import InterviewSession from "./Pages/InterviewSession";
import Dashboard from "./Pages/Dashboard";
import Auth from "./Pages/Auth";
import InterviewDetail from "./Pages/InterviewDetail";
import InterviewResult from "./Pages/InterviewResult";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        <Route
          path="/setup"
          element={
            <PrivateRoute>
              <InterviewSetup />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <PrivateRoute>
              <InterviewSession />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview/:id" 
          element={
            <PrivateRoute>
              <InterviewDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/result/:id"
          element={
            <PrivateRoute>
              <InterviewResult />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}
