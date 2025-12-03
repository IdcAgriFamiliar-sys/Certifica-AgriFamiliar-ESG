// src/components/Login.tsx
import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import type { UserRole } from "../App";

interface Props {
  onLogin: (role: UserRole) => void;
  onBack?: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("agricultor");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // modo simples: usamos a role selecionada para simulação
    onLogin(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Acesso — Certifica AgriFamiliar</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">E-mail</label>
            <div className="flex items-center border rounded px-3 py-2 mt-1 bg-gray-50">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@exemplo.com" className="w-full bg-transparent outline-none" required />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Senha</label>
            <div className="flex items-center border rounded px-3 py-2 mt-1 bg-gray-50">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="senha" className="w-full bg-transparent outline-none" required />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Entrar como (apenas para teste)</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full p-2 border rounded mt-1">
              <option value="agricultor">Agricultor</option>
              <option value="auditor">Auditor</option>
              <option value="coordenador">Coordenador</option>
              <option value="gestor">Gestor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3">
            {onBack && <button type="button" onClick={onBack} className="px-4 py-2 border rounded">Voltar</button>}
            <button type="submit" className="flex-1 px-4 py-2 bg-green-700 text-white rounded">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
