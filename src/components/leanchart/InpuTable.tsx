import React from "react";
import { ChartData, ChartDescription } from "../../types/LeanChartData"; // Assurez-vous que ce type est correctement défini

interface InputTableProps {
  shortTermChart: ChartDescription | undefined; // Le graphique court terme
  onValueChange: (entry: ChartData, newValue: number) => void; // Callback pour gérer les changements
}

const InputTable: React.FC<InputTableProps> = ({ shortTermChart, onValueChange }) => {
  if (!shortTermChart || !Array.isArray(shortTermChart.values)) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const { values } = shortTermChart;

  return (
    <div className="flex justify-center mt-4">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${values.length}, 1fr)`, // Une colonne par champ
        }}
      >
        {values.map((entry) => (
          <div key={entry.date} className="text-center">
            <input
              type="number"
              value={Number(entry.value).toFixed(0)}
              onChange={(e) => onValueChange(entry, Number(e.target.value))} // Appelle onValueChange
              className="w-8 px-1 py-0.5 text-xs text-center border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputTable;