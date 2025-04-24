import React from "react";
import GenericChartComponent from "./GenericChartComponent";
import { LeanChart, ChartData } from "../../types/LeanChart";
import { GenericChartInfo } from "./GenericChartInfo";
import { formatMonthKeyToLabel } from "../../utils/DateUtils";

interface ShortTermChartComponentProps {
  leanChart: LeanChart;
  currentMonth: string; // format "YYYY-MM"
}

const ShortTermChartComponent: React.FC<ShortTermChartComponentProps> = ({ leanChart, currentMonth }) => {
  if (!leanChart || !leanChart.shortTermData || leanChart.shortTermData.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const shouldCumulate = leanChart.isCumulative;

  const values: ChartData[] = shouldCumulate
    ? leanChart.shortTermData.reduce<ChartData[]>((acc, curr, index) => {
        const delta = Number(curr.value);
        const prevValue = index === 0 ? 0 : acc[index - 1].value;
        acc.push({
          date: curr.date,
          value: prevValue + delta,
          target: curr.target,
          comment: curr.comment || '',
        });
        return acc;
      }, [])
    : leanChart.shortTermData;

  const genericChartInfo: GenericChartInfo = {
    title: `${leanChart.shortTermTitle} ${formatMonthKeyToLabel(currentMonth)}`,
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values,
    nbDecimal: leanChart.nbDecimal,
    positiveColor: leanChart.positiveColor,
    negativeColor: leanChart.negativeColor,
    isPositiveColorAboveTarget: leanChart.isPositiveColorAboveTarget,
  };

  return (
    <GenericChartComponent
      genericChartInfo={genericChartInfo}
      tickFormatter={(date) => date.split('-')[0]} // Affiche uniquement le jour
    />
  );
};

export default ShortTermChartComponent;