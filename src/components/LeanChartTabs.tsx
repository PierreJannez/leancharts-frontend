import React, { useState, useEffect } from "react";
import { getIcon } from "../utils/icons"; // Import the icon utility
import { LeanChart } from "../types/LeanChart";
import { LeanChartData, ChartDescription, ChartData } from '../types/LeanChartData'; // Import the shared interface
import { fetchLeanChartData } from "../services/leanChartDataService"; // Import the service
import ShortTermChartComponent from "./leanchart/ShortTermChartComponent"; // Import the ChartComponent
import LongTermChartComponent from "./leanchart/LongTermChartComponent"; // Import the ChartComponent
import InputTable from "./leanchart/InpuTable"; // Import du composant InputTable
import { updateChartValue } from "../services/leanChartDataService"; // Import du service

interface TabsProps {
  leanCharts: LeanChart[];
}

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

  const updateChartField = async (
    chartData: ChartData,
    field: "value" | "target" | "comment",
    newValue: number | string
  ) => {
    if (leanChartData && leanChartData.shortTermChart) {
      // Mettre à jour localement le champ spécifié
      const updatedValues = leanChartData.shortTermChart.values.map((entry) =>
        entry.date === chartData.date ? { ...entry, [field]: newValue } : entry
      );
  
      setLeanChartData({
        ...leanChartData,
        shortTermChart: {
          ...leanChartData.shortTermChart,
          values: updatedValues,
        },
      });
  
      // Appeler le service pour mettre à jour la base de données
      try {
        await updateChartValue(
          activeTab!,
          chartData.date,
          field === "target" ? newValue as number : chartData.target,
          field === "value" ? newValue as number : chartData.value,
          field === "comment" ? newValue as string : chartData.comment
        );
        console.log(`${field} for ${chartData.date} updated successfully to ${newValue}`);
      } catch (error) {
        console.error(`Failed to update ${field} for ${chartData.date}:`, error);
      }
    }
  };
  
  const handleValueChange = (chartData: ChartData, newValue: number) => {
    updateChartField(chartData, "value", newValue);
  };
  
  const handleTargetChange = (chartData: ChartData, newTarget: number) => {
    updateChartField(chartData, "target", newTarget);
  };
  
  const handleCommentChange = (chartData: ChartData, newComment: string) => {
    updateChartField(chartData, "comment", newComment);
  };

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
              <div className="flex justify-center gap-4">
                <div className="w-1/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
                  <LongTermChartComponent
                    chartDescription={leanChartData?.longTermChart as ChartDescription}
                    title="Trois derniers mois"
                  />
                </div>
                <div className="w-3/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
                  <ShortTermChartComponent
                    chartDescription={leanChartData?.shortTermChart as ChartDescription}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-2 gap-4 ">
                <div className="w-1/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
                </div>
                <div className="w-3/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
                  {leanChartData?.shortTermChart && (
                    <InputTable
                      shortTermChart={leanChartData?.shortTermChart}
                      onValueChange={handleValueChange} // Connecte la fonction de gestion des changements de valeur
                      onTargetChange={handleTargetChange} // Connecte la fonction de gestion des changements de target
                      onCommentChange={handleCommentChange} // Connecte la fonction de gestion des changements de comment
                    />                  
                  )}
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