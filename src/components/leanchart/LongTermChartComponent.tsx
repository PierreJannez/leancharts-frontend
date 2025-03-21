import React from "react";
import GenericChartComponent from "./GenericChartComponent"; // Import the generic chart component
import { LeanChart } from "../../types/LeanChart";
import { GenericChartInfo} from "./GenericChartInfo";

interface LongTermChartComponentProps {
  leanChart: LeanChart;
  title: string;
}

const LongTermChartComponent: React.FC<LongTermChartComponentProps> = ({ leanChart, title }) => {
  console.log("📊 leanChart passed to LongTermChartComponent:", leanChart);

  if (!leanChart || !Array.isArray(leanChart.longTermData)) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const genericChartInfo: GenericChartInfo = {
    title: title,
    xLabel: leanChart.longTermxLabel,
    yLabel: leanChart.longTermyLabel,
    values: leanChart.longTermData
  };

  // Passer les données prétraitées au composant générique
  return (
    <GenericChartComponent
      genericChartInfo={genericChartInfo}
      tickFormatter={(date) => {
        const [, month] = date.split('-');
        return `${month}`; // Affiche le mois et l'année
      }}
    />
  );
};

export default LongTermChartComponent;