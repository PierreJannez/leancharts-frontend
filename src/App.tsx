import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Bundle } from "./types/Bundle";
import { fetchBundles } from "./services/bundleService";
import { BundleWrapper } from "./components/Bundle";
import LoginPage from "./components/authentication/LoginPage";
import CreateUserPage from "./components/authentication/CreateUserPage";
import PrivateRoute from "./components/PrivateRoute";
import Main from "./components/Main";
import { useAuth } from "./contexts/AuthContext";
import AdminPage from "@/components/admin/AdminPage";
import { Toaster } from 'sonner'


const AppContent: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [selectedBundleId, setSelectedBundleId] = useState<number | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (isAuthenticated && user && user.id) {
        console.log("Fetching bundles for user:", user.id); 
        // 🔁 Appelle l’API avec un ID ou autre info stockée côté client si nécessaire
        const bundles = await fetchBundles(user?.id); // Remplacer 1 par un ID réel si besoin
        setBundles(bundles);
      }
    }
    fetchData();
  }, [isAuthenticated, user]);

  const handleUpdateBundle = (updated: Bundle) => {
    setBundles(prev =>
      prev.map(b => (b.id === updated.id ? updated : b))
    );
  };  
  const handleLogout = () => {
    logout();
    setBundles([]);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 font-sans">
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg">
          {isAuthenticated && (
            <Header
              menuItems={bundles}
              onSelectBundle={(id) => setSelectedBundleId(id)}
              onLogout={handleLogout}
            />
          )}

          <div className="flex-1 flex p-4 justify-center">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<CreateUserPage />} />
              <Route
                path="/bundle/:bundleName"
                element={
                  <PrivateRoute>
                    <BundleWrapper selectedBundleId={selectedBundleId} />
                  </PrivateRoute>
                }
              />
              {user && (
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminPage
                        initialBundles={bundles}
                        onBundleUpdate={handleUpdateBundle}
                        clientId={user.id}
                      />
                    </PrivateRoute>
                  }
                />
              )}
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
      <Toaster richColors position="top-right" />
    </div>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;