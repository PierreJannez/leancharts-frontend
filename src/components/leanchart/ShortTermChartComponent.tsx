import React from "react";
import GenericChartComponent from "./GenericChartComponent"; // Import the generic chart component
import { LeanChart } from "../../types/LeanChart";
import { GenericChartInfo } from "./GenericChartInfo";

interface ShortTermChartComponentProps {
  leanChart: LeanChart;
}

const getCurrentMonth = () => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

const ShortTermChartComponent: React.FC<ShortTermChartComponentProps> = ({ leanChart }) => {
  if (!leanChart || !leanChart.shortTermData || leanChart.shortTermData.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const genericChartInfo: GenericChartInfo = {
    title: leanChart.shortTermTitle + " " + getCurrentMonth(),
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values: leanChart.shortTermData
  };

  // Pass the preprocessed data to the generic chart component
  return (
    <GenericChartComponent
      genericChartInfo={genericChartInfo}
      tickFormatter={(date) => date.split('-')[0]} // Affiche uniquement le jour
    />
  );
};

export default ShortTermChartComponent;