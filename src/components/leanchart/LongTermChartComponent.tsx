import React from "react";
import GenericChartComponent from "./GenericChartComponent";
import { LeanChart,ChartData } from "../../types/LeanChart";
import { GenericChartInfo } from "./GenericChartInfo";

interface LongTermChartComponentProps {
  leanChart: LeanChart;
}

function getMonthLabel(values: ChartData[]): string {
  if (!values || values.length === 0) return "";

  const months = values.map(v => {
    const [day, month, year] = v.date.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  months.sort((a, b) => a.getTime() - b.getTime());

  const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  const first = months[0];
  const last = months[months.length - 1];

  const firstLabel = formatter.format(first);
  const lastLabel = formatter.format(last);
  const year = last.getFullYear();

  return `${firstLabel} to ${lastLabel} ${year}`;
}

const LongTermChartComponent: React.FC<LongTermChartComponentProps> = ({ leanChart }) => {
  console.log("📊 leanChart passed to LongTermChartComponent:", leanChart);

  if (!leanChart || !Array.isArray(leanChart.longTermData)) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const genericChartInfo: GenericChartInfo = {
    title: getMonthLabel(leanChart.longTermData),
    xLabel: leanChart.longTermxLabel,
    yLabel: leanChart.longTermyLabel,
    values: leanChart.longTermData,
    nbDecimal: leanChart.nbDecimal,
    positiveColor: leanChart.positiveColor,
    negativeColor: leanChart.negativeColor,
    isPositiveColorAboveTarget: leanChart.isPositiveColorAboveTarget
  };

  console.log("📊 genericChartInfo created in LongTermChartComponent:", genericChartInfo);

  return (
    <GenericChartComponent
      genericChartInfo={genericChartInfo}
      tickFormatter={(date) => {
        const [, month] = date.split("-");
        return month;
      }}
    />
  );
};

export default LongTermChartComponent;