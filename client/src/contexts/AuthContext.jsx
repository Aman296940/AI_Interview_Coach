import React, { createContext, useState, useEffect } from "react";
import api, { authAPI } from "../Services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

 const login = async ({ email, password }) => {
  try {
    const res = await authAPI.login({ email, password });
    const { success, accessToken, refreshToken, user: userData, message } = res.data;
    if (!success) return { success: false, message };
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser(userData);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Login failed" };
  }
};


  const register = async ({ name, email, password }) => {
  try {
    const res = await authAPI.register({ name, email, password });
    const { success, accessToken, refreshToken, user: userData, message } = res.data;
    if (!success) return { success: false, message };
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser(userData);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Registration failed" };
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
