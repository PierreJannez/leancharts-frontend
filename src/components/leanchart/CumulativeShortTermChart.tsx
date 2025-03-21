import React from "react";
import { LeanChart, ChartData } from "../../types/LeanChart";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, LabelList } from "recharts";
import { GenericChartInfo } from './GenericChartInfo';


interface CumulativeShortTermChartProps {
  leanChart: LeanChart;
  tickFormatter: (value: string) => string; // Fonction pour formater les ticks de l'axe X
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { date, value, target, comment } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-sm text-gray-700">
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Value:</strong> {Number(value).toFixed(0)}</p>
        <p><strong>Target:</strong> {Number(target).toFixed(0)}</p>
        <p><strong>Comment:</strong> {comment || "No comment"}</p>
      </div>
    );
  }

  return null;
};

const getCurrentMonth = () => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

const CumulativeShortTermChart: React.FC<CumulativeShortTermChartProps> = ({ leanChart, tickFormatter }) => {
  if (!leanChart || !leanChart.shortTermData || leanChart.shortTermData.length === 0) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const genericChartInfo: GenericChartInfo = {
    title: leanChart.shortTermTitle + " " + getCurrentMonth(),
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values: leanChart.shortTermData
  };

  // Fonction utilitaire pour calculer les valeurs miroir-sommées
  const cumulativeValues = (values: ChartData[]): number[] => {
    const result: number[] = [];
    const len = values.length;
    let previous = Number(values[0].value);
    result.push(previous);

    for (let i = 1; i < len; i++) {
      const current = Number(values[i].value) + previous;
      previous = current;
      result.push(current);
    }
    return result;
  };

  const cumulative = cumulativeValues(genericChartInfo.values);
  genericChartInfo.values = genericChartInfo.values.map((entry, index) => ({
    ...entry,
    value: cumulative[index] ?? 0,
  }));

  const axisTickStyle = {
    fontSize: 12,
    fontFamily: "system-ui",
    fill: "#333",
  };

  const axisLabelStyle = {
    fontSize: "14px",
    fontFamily: "system-ui",
    fill: "#555",
    fontWeight: "bold",
  };

  const COLOR_FILL_ABOVE_TARGET = "rgba(239, 68, 68,0.5)"; // Soft red
  const COLOR_FILL_BELOW_TARGET = "rgba(34, 197, 94, 0.5)"; // Soft green
  const COLOR_TEXT_ABOVE_TARGET = "rgb(239, 68, 68)";
  const COLOR_TEXT_BELOW_TARGET = "rgb(34, 197, 94)";

  const maxTarget = Math.max(...genericChartInfo.values.map((entry) => entry.target));
  const yAxisMax = Math.ceil(maxTarget * 1.1); // Add 10% margin above the max target

  return (
    <div>
      <h2 className="text-center text-lg font-bold text-gray-700 mb-4"
          style={{
          fontSize: 16, // Taille de la police
          fontFamily: "system-ui", // Définir la police sur system-ui
          color: "#333", // Couleur du texte
          }}>
        {genericChartInfo.title}
        </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={genericChartInfo.values} barCategoryGap={14}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={axisTickStyle}
            label={{
              value: genericChartInfo.xLabel,
              position: "insideBottom",
              offset: -3,
              style: axisLabelStyle,
            }}
          />
          <YAxis
            domain={[0, yAxisMax]}
            tick={axisTickStyle}
            label={{
              value: genericChartInfo.yLabel,
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: axisLabelStyle,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="target" stroke="red" strokeWidth={2} />
          <Bar dataKey="value" barSize={30}>
            <LabelList
              dataKey="value"
              position="top"
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                fontFamily: "system-ui",
              }}
              content={({ x, y, width, value, index }) => {
                const isAboveTarget = index !== undefined && Number(genericChartInfo.values[index]?.value || 0) >= Number(genericChartInfo.values[index]?.target || 0);
                const color = isAboveTarget ? COLOR_TEXT_ABOVE_TARGET : COLOR_TEXT_BELOW_TARGET;
                const roundedValue = Math.round(Number(value));

                const centeredX = (Number(x) || 0) + Number(width) / 2;
                const adjustedY = Number(y) - 5;

                return (
                  <text
                    x={centeredX}
                    y={adjustedY}
                    fill={color}
                    textAnchor="middle"
                    style={{ fontFamily: "system-ui", fontSize: "12px" }}
                  >
                    {roundedValue}
                  </text>
                );
              }}
            />
            {genericChartInfo.values.map((entry, index) => {
              const isAboveTarget = Number(entry.value) >= Number(entry.target);
              const fillColor = isAboveTarget ? COLOR_FILL_ABOVE_TARGET : COLOR_FILL_BELOW_TARGET;
              const strokeColor = isAboveTarget ? "red" : "green";

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={1}
                />
              );
            })}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeShortTermChart;