import React, { useState, useEffect, useCallback } from "react";
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
      if (isAuthenticated && user?.id) {
        const bundles = await fetchBundles(user.id);
        setBundles(bundles);
      }
    }
    fetchData();
  }, [isAuthenticated, user]);

  const handleSelectBundle = useCallback((id: number) => {
    setSelectedBundleId(id);
  }, []); // ✅ stable, évite de recréer une fonction à chaque render

  const handleUpdateBundle = (updated: Bundle) => {
    if (!updated) return;
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
              onSelectBundle={handleSelectBundle}
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
                        client={user}
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