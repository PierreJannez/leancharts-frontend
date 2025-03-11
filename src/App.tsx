import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { Bundle } from "./types/Bundle";
import { fetchBundles } from "./services/bundleService"; // Import the bundle service
import { BundleWrapper } from "./components/Bundle";

const App: React.FC = () => {
  const [selectedBundleId, setSelectedBundleId] = useState<number | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);

  useEffect(() => {
    setBundles(fetchBundles()); // Fetch bundles using the service
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 font-sans">
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Pass menuItems as a prop to Header */}
          <Header menuItems={bundles} onSelectBundle={(id) => setSelectedBundleId(id)} />

          {/* Content with Routing */}
          <div className="flex-1 flex p-4 justify-center">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/bundle/:bundleName" element={<BundleWrapper selectedBundleId={selectedBundleId} />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;