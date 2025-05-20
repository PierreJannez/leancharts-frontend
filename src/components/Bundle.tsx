import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchLeanCharts } from "../services/leanChartService"; // Import service
import LeanChartTabs from "./LeanChartTabs";
import { LeanChart } from "../types/LeanChart";
import Main from "./Main";

interface BundleProps {
  bundleName: string;
  selectedBundleId: number | null;
}

const Bundle: React.FC<BundleProps> = ({ bundleName: bundleName, selectedBundleId: selectedBundleId }) => {
  const [leanCharts, setLeanCharts] = useState<LeanChart[]>([]);

  useEffect(() => {
    if (selectedBundleId !== null) {
      fetchLeanCharts(selectedBundleId).then((leanCharts) => setLeanCharts(leanCharts));
    }
  }, [selectedBundleId]);

  return (
    <div className="w-full px-4 py-6 shadow-md rounded-lg bg-gray-100">
      <h2 className="text-2xl font-bold text-left">{bundleName}</h2>
      {/* Tabs for the selected bundle */}
      {selectedBundleId ? <LeanChartTabs leanCharts={leanCharts} bundleTitle={bundleName} /> : <p className="text-center text-gray-500">Select a bundle</p>}
    </div>
  );
};

// Wrapper to fetch URL parameters and pass them to GroupPage
interface BundleWrapperProps {
  selectedBundleId: number | null;
}

export const BundleWrapper: React.FC<BundleWrapperProps> = ({ selectedBundleId: selectedBundleId }) => {
  const { bundleName: bundleName } = useParams();
  return bundleName ? <Bundle bundleName={bundleName} selectedBundleId={selectedBundleId} /> : <Main />;
};

export default Bundle;