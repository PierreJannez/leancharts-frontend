import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService"; // Assurez-vous que le chemin est correct
import { useAuth } from "../../hooks/useAuth"; // Assurez-vous que le chemin est correct

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authResponse = await login({ email, password }); // Appelle le service d'authentification
      console.log("Login Page Auth response:", authResponse.user);
      setUser(authResponse.user); // Met à jour le contexte utilisateur
      navigate("/main"); // Redirige vers la page principale
    } catch (err) {
      setError("Email ou mot de passe incorrect." + err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Connexion</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginPage;