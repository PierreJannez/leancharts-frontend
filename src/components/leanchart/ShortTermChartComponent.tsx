import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { ChartData } from '../../types/LeanChartData'; // Import the shared interface

interface LongTermChartComponentProps {
  data: ChartData[];
}

const ShortTermChartComponent: React.FC<LongTermChartComponentProps> = ({ data }) => {

  if (data === undefined || data.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        
        {/* Line for the target */}
        <Line type="monotone" dataKey="target" stroke="red" strokeWidth={2} />

        {/* Bars with dynamic color */}
        <Bar dataKey="value" barSize={40} fill="gray">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={Number(entry.value) >= Number(entry.target) ? "green" : "red"} // Correct color logic
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ShortTermChartComponent;