import React, { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      setUser(data.user);
      navigate("/"); // ou autre route après login
    } catch (err) {
      setError("Email ou mot de passe incorrect." + err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      {error && <div className="text-red-600">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;