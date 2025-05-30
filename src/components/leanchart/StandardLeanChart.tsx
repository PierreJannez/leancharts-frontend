import React from "react";
import { LeanChart, ChartData } from "../../types/LeanChart";
import LongTermChartComponent from "./LongTermChartComponent";
import ShortTermChartComponent from "./ShortTermChartComponent";
import WeeklyShortTermChartComponent from "./WeeklyShortTermChart";
import StandardLongTermInputTable from "./StandardLongTermInputTable";
import StandardShortTermInputTable from "./StandardShortTermInputTable";
import WeeklyShortTermInputTable from "./WeeklyShortTermInputTable";

interface Props {
  leanChart: LeanChart;
  currentMonth: string; // format "YYYY-MM"
  onUpdateShortTerm: (chartData: ChartData, field: "value" | "target" | "comment", newValue: number | string) => void;
  onUpdateLongTerm: (chartData: ChartData, field: "value" | "target" | "comment", newValue: number | string) => void;
  onUpdateMainTarget: (newTarget: number) => void; // 👈 nouvelle prop
  onRefreshRequested?: () => void; // 👈 nouvelle prop facultative
}

export const StandardLeanChart: React.FC<Props> = ({ leanChart, currentMonth,  onUpdateShortTerm, onUpdateLongTerm, onUpdateMainTarget, onRefreshRequested }) => {

  console.log("StandardLeanChart->leanChart.longTermData", leanChart.longTermData);
  console.log("StandardLeanChart->leanChart.shortTermData", leanChart.shortTermData);
  return (
    <div key={leanChart.id} className="text-center">
      <div className="flex justify-center gap-4">
        <div className="w-1/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
          <LongTermChartComponent leanChart={leanChart} />
        </div>
        <div className="w-3/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
          {leanChart.periodicity === "weekly" ? (
            <WeeklyShortTermChartComponent leanChart={leanChart} currentMonth={currentMonth} />
          ) : (
            <ShortTermChartComponent leanChart={leanChart} currentMonth={currentMonth} />
          )}
        </div>
      </div>
      <div className="flex justify-center mt-2 gap-4 ">
        <div className="w-1/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
          <StandardLongTermInputTable
            leanChart={leanChart}
            onValueChange={(chartData, newValue) => onUpdateLongTerm(chartData, "value", newValue)}
            onTargetChange={(chartData, newTarget) => onUpdateLongTerm(chartData, "target", newTarget)}
            onCommentChange={(chartData, newComment) => onUpdateLongTerm(chartData, "comment", newComment)}
          />
        </div>
        <div className="w-3/4 bg-gray-100 rounded-md shadow p-4 border-1 border-gray-300">
          {leanChart.periodicity === "weekly" ? (
            <WeeklyShortTermInputTable
              leanChart={leanChart}
              onValueChange={(chartData, newValue) => onUpdateShortTerm(chartData, "value", newValue)}
              onTargetChange={(chartData, newTarget) => onUpdateShortTerm(chartData, "target", newTarget)}
              onCommentChange={(chartData, newComment) => onUpdateShortTerm(chartData, "comment", newComment)}
              onMainTargetChange={(newTarget) => onUpdateMainTarget(newTarget)}
              onRefreshRequested={onRefreshRequested}
            />
          ) : (
            <StandardShortTermInputTable
              leanChart={leanChart}
              onValueChange={(chartData, newValue) => onUpdateShortTerm(chartData, "value", newValue)}
              onTargetChange={(chartData, newTarget) => onUpdateShortTerm(chartData, "target", newTarget)}
              onCommentChange={(chartData, newComment) => onUpdateShortTerm(chartData, "comment", newComment)}
              onMainTargetChange={(newTarget) => onUpdateMainTarget(newTarget)}
              onRefreshRequested={onRefreshRequested}
            />
          )}
        </div>
      </div>
    </div>
  );
};
