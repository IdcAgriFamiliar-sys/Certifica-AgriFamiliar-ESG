// src/components/Login.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types";

interface Props {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onBack }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, senha);
      // Get user data from localStorage (set by API mock)
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const role = userData.role || "admin"; // Default to admin for testing
      onLogin(role as UserRole);
    } catch (err: any) {
      setError(err.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    // Quick login for testing
    const mockUser = {
      id: Math.random(),
      nome: `Usuário ${role}`,
      email: `${role}@example.com`,
      role: role,
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "mock-token-123");
    onLogin(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="senha"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onBack}
              className="text-blue-600 hover:underline"
            >
              ← Voltar
            </button>
            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">Acesso rápido (teste):</p>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin("admin")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickLogin("gestor")}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Gestor
            </button>
            <button
              onClick={() => handleQuickLogin("auditor")}
              className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
            >
              Auditor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
