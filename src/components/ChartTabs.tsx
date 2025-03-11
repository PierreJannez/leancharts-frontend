import React, { useState, useEffect } from "react";
import { getIcon } from "../utils/icons"; // Import the icon utility
import { Chart } from "../types/Chart";

interface TabsProps {
  charts: Chart[];
}

const ChartTabs: React.FC<TabsProps> = ({ charts }) => {
  const [activeTab, setActiveTab] = useState<number | null>(charts.length > 0 ? charts[0].id : null);

  useEffect(() => {
    if (charts.length > 0) {
      setActiveTab(charts[0].id);
    }
  }, [charts]);

  if (charts.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  return (
    <div className="w-full p-4">
      {/* Tabs Navigation - Styled as real tabs */}
      <div className="flex border-b border-gray-300">
        {charts.map((chart) => {
          const IconComponent = getIcon(chart.icon); // Get the icon dynamically

          return (
            <button
              key={chart.id}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all rounded-t-lg border 
                ${
                  activeTab === chart.id
                    ? "bg-white border-b-transparent text-blue-600 font-bold"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                }`}
              onClick={() => setActiveTab(chart.id)}
            >
              <IconComponent size={16} className="text-gray-600" /> {/* Render icon */}
              {chart.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content - Connected to Active Tab */}
      <div className="mt-0 p-4 border border-gray-300 rounded-b-lg bg-white shadow-md">
        {charts.map((chart) =>
          activeTab === chart.id ? (
            <div key={chart.id} className="text-center">
              <h2 className="text-xl font-semibold">{chart.name}</h2>
              <p className="text-gray-600">
                X-Axis: {chart.xLabel} | Y-Axis: {chart.yLabel}
              </p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ChartTabs;