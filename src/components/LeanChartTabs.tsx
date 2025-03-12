import React, { useState, useEffect } from "react";
import { getIcon } from "../utils/icons"; // Import the icon utility
import { LeanChart } from "../types/LeanChart";
import ChartComponent from "./"; // Import the ChartComponent


interface TabsProps {
  leanCharts: LeanChart[];
}

const LeanChartTabs: React.FC<TabsProps> = ({ leanCharts }) => {
  const [activeTab, setActiveTab] = useState<number | null>(leanCharts.length > 0 ? leanCharts[0].id : null);

  useEffect(() => {
    if (leanCharts.length > 0) {
      setActiveTab(leanCharts[0].id);
    }
  }, [leanCharts]);

  if (leanCharts.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  return (
    <div className="w-full p-4">
      {/* Tabs Navigation - Styled as real tabs */}
      <div className="flex border-b border-gray-300">
        {leanCharts.map((leanChart) => {
          const IconComponent = getIcon(leanChart.icon); // Get the icon dynamically

          return (
            <button
              key={leanChart.id}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all rounded-t-lg border 
                ${
                  activeTab === leanChart.id
                    ? "bg-white border-b-transparent text-blue-600 font-bold"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                }`}
              onClick={() => setActiveTab(leanChart.id)}
            >
              <IconComponent size={16} className="text-gray-600" /> {/* Render icon */}
              {leanChart.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content - Connected to Active Tab */}
      <div className="mt-0 p-4 border border-gray-300 rounded-b-lg bg-white shadow-md">
        {leanCharts.map((leanChart) =>
          activeTab === leanChart.id ? (
            <div key={leanChart.id} className="text-center">
              <h2 className="text-xl font-semibold">{leanChart.name}</h2>
              <ChartComponent /> {/* Use the ChartComponent here */}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default LeanChartTabs;