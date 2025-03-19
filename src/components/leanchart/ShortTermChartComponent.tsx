import React from "react";
import GenericChartComponent from "./GenericChartComponent"; // Import the generic chart component
import { ChartDescription } from "../../types/LeanChartData";

interface ShortTermChartComponentProps {
  chartDescription: ChartDescription;
}

const getCurrentMonth = () => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

// Helper function to generate all working days of the current month
const generateWorkingDays = (): string[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based index for months
  const dates: string[] = [];

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the current month

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Format the date as dd-mm-yyyy
      const formattedDate = `${String(day).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`;
      dates.push(formattedDate);
    }
  }
  return dates;
};

const ShortTermChartComponent: React.FC<ShortTermChartComponentProps> = ({ chartDescription }) => {
  if (!chartDescription || !Array.isArray(chartDescription.values)) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const { mainTarget, values } = chartDescription;

  // Generate working days and merge with existing data
  const workingDays = generateWorkingDays();
  const mergedData = workingDays.map((date) => {
    const existingData = values.find((entry) => entry.date === date);
    return existingData || { date, target: mainTarget, value: 0, comment: "" };
  });

  // Pass the preprocessed data to the generic chart component
  return (
    <GenericChartComponent
      chartDescription={{ ...chartDescription, values: mergedData }}
      title={`${chartDescription.title} - ${getCurrentMonth()}`}
      tickFormatter={(date) => date.split('-')[0]} // Affiche uniquement le jour
    />
  );
};

export default ShortTermChartComponent;