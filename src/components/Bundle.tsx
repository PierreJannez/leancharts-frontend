import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCharts } from "../services/chartService"; // Import service
import ChartTabs from "./ChartTabs";
import { Chart } from "../types/Chart";
import Main from "./Main";

interface BundleProps {
  bundleName: string;
  selectedBundleId: number | null;
}

const Bundle: React.FC<BundleProps> = ({ bundleName: bundleName, selectedBundleId: selectedBundleId }) => {
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    setCharts(fetchCharts(selectedBundleId)); // Use the chart service
  }, [selectedBundleId]);

  return (
    <div className="w-full px-4 py-6 shadow-md rounded-lg bg-gray-100">
      <h2 className="text-2xl font-bold text-left">{bundleName}</h2>

      {/* Tabs for the selected bundle */}
      {selectedBundleId ? <ChartTabs charts={charts} /> : <p className="text-center text-gray-500">Sélectionnez un bundle</p>}
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