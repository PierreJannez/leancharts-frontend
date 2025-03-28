import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Bundle } from "./types/Bundle";
import { fetchBundles } from "./services/bundleService";
import { BundleWrapper } from "./components/Bundle";
import LoginPage from "./components/authentication/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import Main from "./components/Main"; // Importez le composant Main
import { useAuth } from "./hooks/useAuth"; // Importez le contexte d'authentification

const AppContent: React.FC = () => {
  const [selectedBundleId, setSelectedBundleId] = useState<number | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const { user, setUser, logout } = useAuth(); // Utilisez le contexte d'authentification
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching bundles...")
      if (user && user.id) { // Vérifiez que l'utilisateur est connecté et que l'ID est disponible
        console.log("User ID:", user.id);
        const bundles = await fetchBundles(user.id); // Utilisez l'ID du client pour rechercher les bundles
        console.log("User bundles:", bundles);
        setBundles(bundles);
      }
    }
    fetchData();
  }, [user]); // Ajoutez `user` comme dépendance pour recharger les bundles après la connexion


  const handleLogout = () => {
    logout(); // Supprime l'utilisateur du contexte
    setUser(null); // Réinitialise l'utilisateur
    setBundles([]); // Réinitialise les bundles
    navigate("/login"); // Redirige vers la page de login
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 font-sans">
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg">
          <Header
            menuItems={bundles}
            onSelectBundle={(id) => setSelectedBundleId(id)}
            onLogout={handleLogout} // Passe la fonction de déconnexion
          />

          <div className="flex-1 flex p-4 justify-center">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/bundle/:bundleName"
                element={
                  <PrivateRoute>
                    <BundleWrapper selectedBundleId={selectedBundleId} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/main"
                element={
                  <PrivateRoute>
                    <Main />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppContent />
  );
};

export default App;