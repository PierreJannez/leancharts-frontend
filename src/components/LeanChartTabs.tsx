// LeanChartTabs.tsx
import React, { useState, useEffect } from "react";
import { getIcon } from "../utils/icons";
import { LeanChart, LeanChartData, ChartData } from '../types/LeanChart';
import { fetchLeanChartData, updateShortTermChartValue, updateLongTermChartValue } from "../services/leanChartDataService";
import { StandardLeanChart } from "./leanchart/StandardLeanChart";
import { CumulativeLeanChart } from "./leanchart/CumulativeLeanChart";
import { Edit3 } from "lucide-react"; // Importez l'icône de crayon

interface TabsProps {
  leanCharts: LeanChart[];
}

const LeanChartTabs: React.FC<TabsProps> = ({ leanCharts }) => {
  const [activeTab, setActiveTab] = useState<number | null>(leanCharts.length > 0 ? leanCharts[0].id : null);
  const [currentLeanChart, setCurrentLeanChart] = useState<LeanChart | undefined>(leanCharts.length > 0 ? leanCharts[0] : undefined);

  useEffect(() => {
    if (leanCharts.length > 0) {
      setActiveTab(leanCharts[0].id);
    }
  }, [leanCharts]);

  useEffect(() => {
    if (activeTab !== null) {
      fetchLeanChartData(activeTab)
        .then((data: LeanChartData) => {
          const selectedChart = leanCharts.find(chart => chart.id === activeTab);
          if (selectedChart) {
            setCurrentLeanChart({
              ...selectedChart,
              longTermData: [...data.longTermValues],
              shortTermData: [...data.shortTermValues]
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching chart data:", error);
          setCurrentLeanChart(undefined);
        });
    }
  }, [activeTab, leanCharts]);

  if (leanCharts.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const updateShortTermChartField = async (chartData: ChartData, field: "value" | "target" | "comment", newValue: number | string) => {
    if (currentLeanChart && currentLeanChart.shortTermData) {
      const updatedValues = currentLeanChart.shortTermData.map((entry) =>
        entry.date === chartData.date ? { ...entry, [field]: newValue } : entry
      );
      setCurrentLeanChart({ ...currentLeanChart, shortTermData: updatedValues });

      try {
        await updateShortTermChartValue(
          activeTab!,
          chartData.date,
          field === "target" ? newValue as number : chartData.target,
          field === "value" ? newValue as number : chartData.value,
          field === "comment" ? newValue as string : chartData.comment
        );
      } catch (error) {
        console.error(`Failed to update ${field} for ${chartData.date}:`, error);
      }
    }
  };

  const updateLongTermChartField = async (chartData: ChartData, field: "value" | "target" | "comment", newValue: number | string) => {
    if (currentLeanChart && currentLeanChart.longTermData) {
      const updatedValues = currentLeanChart.longTermData.map((entry) =>
        entry.date === chartData.date ? { ...entry, [field]: newValue } : entry
      );
      setCurrentLeanChart({ ...currentLeanChart, longTermData: updatedValues });

      try {
        await updateLongTermChartValue(
          activeTab!,
          chartData.date,
          field === "target" ? newValue as number : chartData.target,
          field === "value" ? newValue as number : chartData.value,
          field === "comment" ? newValue as string : chartData.comment
        );
      } catch (error) {
        console.error(`Failed to update ${field} for ${chartData.date}:`, error);
      }
    }
  };

  const renderChartComponent = () => {
    if (!currentLeanChart) return null;
    switch (currentLeanChart.UXComponent) {
      case "StandardLeanChart":
        return (
          <StandardLeanChart
            leanChart={currentLeanChart}
            onUpdateShortTerm={updateShortTermChartField}
            onUpdateLongTerm={updateLongTermChartField}
          />
        );
      case "CumulativeLeanChart":
        return (
          <CumulativeLeanChart
            leanChart={currentLeanChart}
            onUpdateShortTerm={updateShortTermChartField}
            onUpdateLongTerm={updateLongTermChartField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex border-b-0">
      {leanCharts.map((leanChart) => {
      const IconComponent = getIcon(leanChart.icon);
      return (
        <div key={leanChart.id} className="flex items-center w-full">
          <button
            className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all rounded-t-lg border bg-white 
              ${activeTab === leanChart.id ? "border-gray-400 text-blue-600 font-bold" : "text-gray-700 border-gray-400 hover:bg-gray-100"}`}
            onClick={() => setActiveTab(leanChart.id)}
          >
            <IconComponent size={16} className={`${activeTab === leanChart.id ? "text-blue-600" : "text-gray-600"}`} />
            {leanChart.name}
          </button>
          {activeTab === leanChart.id && (
            <Edit3 size={20} className="ml-auto text-gray-500 cursor-pointer hover:text-blue-600" />
          )}
        </div>
      );
    })}
      </div>

      <div className="mt-0 p-4 border border-gray-300 rounded-b-lg bg-white shadow-md relative">
      {renderChartComponent()}
      </div>
    </div>
  );
};

export default LeanChartTabs;
