import React from "react";
import GenericChartComponent from "./GenericChartComponent";
import { LeanChart } from "../../types/LeanChart";
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

  const genericChartInfo: GenericChartInfo = {
    title: `${leanChart.shortTermTitle} ${formatMonthKeyToLabel(currentMonth)}`,
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values: leanChart.shortTermData,
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