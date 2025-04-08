import React, { useState, useEffect } from "react";
import { getIcon } from "../utils/icons";
import { LeanChart, ChartData } from '../types/LeanChart';
import { fetchLeanChartData, updateShortTermChartValue, updateLongTermChartValue } from "../services/leanChartDataService";
import { updateLeanChart } from "../services/leanChartService";
import { StandardLeanChart } from "./leanchart/StandardLeanChart";
import { CumulativeLeanChart } from "./leanchart/CumulativeLeanChart";
import { Toaster } from "sonner";
import { ChevronLeft, ChevronRight, SquareActivity } from "lucide-react";
import { addMonths, format } from "date-fns";
import LeanChartGrid from "./leanchart/LeanChartGrid";

interface TabsProps {
  leanCharts: LeanChart[];
}

const LeanChartTabs: React.FC<TabsProps> = ({ leanCharts }) => {
  const [charts, setCharts] = useState<LeanChart[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0); // ✅ Vue Grille par défaut
  const [currentLeanChart, setCurrentLeanChart] = useState<LeanChart | undefined>(undefined);
  const [monthOffset, setMonthOffset] = useState(0);

  const getCurrentMonthKey = () => {
    const targetDate = addMonths(new Date(), monthOffset);
    return format(targetDate, "yyyy-MM");
  };

  const currentMonthKey = getCurrentMonthKey();

  const fetchAllCharts = async () => {
    try {
      const updated = await Promise.all(
        leanCharts.map(async (chart) => {
          const data = await fetchLeanChartData(chart.id, getCurrentMonthKey());
          return {
            ...chart,
            longTermData: data.longTermValues,
            shortTermData: data.shortTermValues,
          };
        })
      );
      setCharts(updated);
    } catch (err) {
      console.error("Erreur chargement des charts :", err);
    }
  };

  const fetchSingleChart = async (chartId: number) => {
    try {
      const data = await fetchLeanChartData(chartId, getCurrentMonthKey());
      const selectedChart = leanCharts.find((chart) => chart.id === chartId);
      if (selectedChart) {
        const updatedChart = {
          ...selectedChart,
          longTermData: [...data.longTermValues],
          shortTermData: [...data.shortTermValues],
        };
        setCurrentLeanChart(updatedChart);
      }
    } catch (error) {
      console.error("Erreur chargement graphique :", error);
      setCurrentLeanChart(undefined);
    }
  };

  useEffect(() => {
    fetchAllCharts();
  }, [leanCharts, monthOffset]);

  useEffect(() => {
    if (activeTab === 0) {
      fetchAllCharts();
    } else {
      fetchSingleChart(activeTab);
    }
  }, [activeTab]);

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

  const updateMainTarget = async (target: number) => {
    if (!currentLeanChart) return;

    const updatedChart = { ...currentLeanChart, shortTermMainTarget: target };
    setCurrentLeanChart(updatedChart);

    setCharts(prev =>
      prev.map(chart => chart.id === updatedChart.id ? updatedChart : chart)
    );

    try {
      await updateLeanChart(updatedChart);
    } catch (error) {
      console.error("Failed to update main target:", error);
    }
  };

  const renderChartComponent = () => {
    if (activeTab === 0) {
      return <LeanChartGrid leanCharts={charts} currentMonth={currentMonthKey} />;
    }

    if (!currentLeanChart) return null;

    const props = {
      leanChart: currentLeanChart,
      currentMonth: currentMonthKey,
      onUpdateShortTerm: updateShortTermChartField,
      onUpdateLongTerm: updateLongTermChartField,
      onUpdateMainTarget: updateMainTarget,
    };

    switch (currentLeanChart.UXComponent) {
      case "StandardLeanChart":
        return <StandardLeanChart {...props} />;
      case "CumulativeLeanChart":
        return <CumulativeLeanChart {...props} />;
      default:
        return null;
    }
  };

  const handleMonthChange = (direction: number) => {
    setMonthOffset((prev) => prev + direction);
  };

  return (
    <div className="w-full p-4">
      <Toaster position="top-right" richColors closeButton />
      <div className="flex items-center justify-between border-b-0">
        <div className="flex">
          <button
            key={0}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all rounded-t-lg border 
              ${activeTab === 0 ? "border-gray-400 text-blue-600 font-bold bg-gray-100" : "text-gray-700 border-gray-400 bg-white hover:bg-gray-100"}`}
            onClick={() => setActiveTab(0)}
          >
            <SquareActivity size={16} className={activeTab === 0 ? "text-blue-600" : "text-gray-600"} />
            Synthèse
          </button>

          {charts.map((leanChart) => {
            const IconComponent = getIcon(leanChart.icon);
            return (
              <button
                key={leanChart.id}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all rounded-t-lg border 
                  ${activeTab === leanChart.id ? "border-gray-400 text-blue-600 font-bold bg-gray-100" : "text-gray-700 border-gray-400 bg-white hover:bg-gray-100"}`}
                onClick={() => setActiveTab(leanChart.id)}
              >
                <IconComponent size={16} className={activeTab === leanChart.id ? "text-blue-600" : "text-gray-600"} />
                {leanChart.name}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleMonthChange(-1)}
            className="bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            className="bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="mt-0 p-4 border border-gray-300 rounded-b-lg bg-white shadow-md relative">
        {renderChartComponent()}
      </div>
    </div>
  );
};

export default LeanChartTabs;
