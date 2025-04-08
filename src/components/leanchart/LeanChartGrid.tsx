import React from "react";
import { LeanChart } from "../../types/LeanChart";
import CumulativeShortTermChartComponent from "./CumulativeShortTermChart";
import ShortTermChartComponent from "./ShortTermChartComponent";

interface LeanChartGridProps {
  leanCharts: LeanChart[];
  currentMonth: string;
}

const LeanChartGrid: React.FC<LeanChartGridProps> = ({ leanCharts, currentMonth }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {leanCharts.map((chart) => {
        const key = `${chart.id}-${chart.name}`;
        const ChartComponent = chart.UXComponent === "CumulativeLeanChart"
          ? CumulativeShortTermChartComponent
          : ShortTermChartComponent;

        return (
          <div key={key} className="border border-gray-400 rounded-lg p-4 bg-white">
            <ChartComponent
              leanChart={chart}
              currentMonth={currentMonth}
              tickFormatter={(date) => date.split("-")[0]}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LeanChartGrid;
