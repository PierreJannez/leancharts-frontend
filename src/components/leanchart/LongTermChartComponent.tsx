import React, { useEffect, useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { fetchLongTermChart } from '../../services/longTermChartService'; // Import the service
import { LongTermChart, ChartData } from '../../types/LongTermChart'; // Import the shared interface

interface LongTermChartComponentProps {
  longTermChartId: number;
}

const LongTermChartComponent: React.FC<LongTermChartComponentProps> = ({ longTermChartId }) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchLongTermChart(longTermChartId).then((longTermChart: LongTermChart) => {
      // Convert values to numbers and map data correctly
      const lastThreeMonthsData: ChartData[] = longTermChart.values.slice(-3).map((value) => {
        return {
          date: new Date(value.date).toISOString().split('T')[0], // Ensure proper date format
          value: value.value, 
          target: value.target, 
          comment: value.comment,
        };
      });

      setData(lastThreeMonthsData);
    }).catch((error) => {
      console.error("Error fetching chart data:", error);
      setData([]); // Ensure chart doesn't break on error
    });
  }, [longTermChartId]);

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
              fill={entry.value >= entry.target ? "green" : "red"} // Correct color logic
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default LongTermChartComponent;