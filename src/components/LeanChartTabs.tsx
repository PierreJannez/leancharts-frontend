import React, { useState, useEffect } from "react";
import { getIcon } from "../utils/icons"; // Import the icon utility
import { LeanChart } from "../types/LeanChart";
import { LeanChartData, ChartData } from '../types/LeanChartData'; // Import the shared interface
import { fetchLeanChartData } from "../services/leanChartDataService"; // Import the service
import LongTermChartComponent from "./leanchart/LongTermChartComponent"; // Import the ChartComponent
import ShortTermChartComponent from "./leanchart/ShortTermChartComponent";

interface TabsProps {
  leanCharts: LeanChart[];
}

const getCurrentMonth = () => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

const LeanChartTabs: React.FC<TabsProps> = ({ leanCharts }) => {
  const [activeTab, setActiveTab] = useState<number | null>(leanCharts.length > 0 ? leanCharts[0].id : null);
  const [leanChartData, setLeanChartData] = useState<LeanChartData>();

  useEffect(() => {
    if (leanCharts.length > 0) {
      setActiveTab(leanCharts[0].id);
    }
  }, [leanCharts]);

  useEffect(() => {
    if (activeTab !== null) {
        fetchLeanChartData(activeTab).then((leanChartData: LeanChartData) => {
        setLeanChartData(leanChartData);
      }).catch((error) => {
        console.error("Error fetching chart data:", error);
        setLeanChartData(undefined); // Ensure chart doesn't break on error
      });
    }
  }, [activeTab]);

  if (leanCharts.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  return (
    <div className="w-full p-4">
      {/* Tabs Navigation - Styled as real tabs */}
      <div className="flex border-b border-gray-300">
        {leanCharts.map((leanChart) => {
          console.log("3-LeanChart:", leanChart);
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
        { leanCharts.map((leanChart) =>
          activeTab === leanChart.id ? (
            <div key={leanChart.id} className="text-center">
              <h2 className="text-xl font-semibold">{leanChart.name}</h2>
              <div className="flex justify-center gap-4">
                <div className="w-1/3 bg-gray-100 rounded-lg shadow p-4">
                  <p className="text-gray-500">Trois derniers mois</p>
                  <LongTermChartComponent data={leanChartData?.longTermChart.values as ChartData[]} /> {/* Pass the data as a prop */}
                </div>
                <div className="w-2/3 bg-gray-100 rounded-lg shadow p-4">
                  <p className="text-gray-500">{getCurrentMonth()}</p>
                  <ShortTermChartComponent data={leanChartData?.shortTermChart.values as ChartData[]} /> {/* Pass the data as a prop */}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default LeanChartTabs;