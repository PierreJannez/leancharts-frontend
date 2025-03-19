import React from "react";
import GenericChartComponent from "./GenericChartComponent"; // Import the generic chart component
import { ChartDescription } from "../../types/LeanChartData";

interface LongTermChartComponentProps {
  chartDescription: ChartDescription;
  title: string;
}

const LongTermChartComponent: React.FC<LongTermChartComponentProps> = ({ chartDescription, title }) => {
  if (!chartDescription || !Array.isArray(chartDescription.values)) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  // Passer les données prétraitées au composant générique
  return (
    <GenericChartComponent
      chartDescription={chartDescription}
      title={title}
      tickFormatter={(date) => {
        const [, month] = date.split('-');
        return `${month}`; // Affiche le mois et l'année
      }}
    />
  );
};

export default LongTermChartComponent;