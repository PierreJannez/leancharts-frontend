import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ChartDescription } from '../../types/LeanChartData'; // Import the updated type

interface LongTermChartComponentProps {
  chartDescription: ChartDescription; // Accept ChartDescription as a prop
}

// Custom Tooltip Component
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

const LongTermChartComponent: React.FC<LongTermChartComponentProps> = ({ chartDescription }) => {
  if (!chartDescription || !Array.isArray(chartDescription.values)) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const { xLabel, yLabel, mainTarget, values } = chartDescription;

  const axisTickStyle = {
    fontSize: 12, // Taille de la police
    fontFamily: "system-ui", // Police utilisée
    fill: "#333", // Couleur du texte
  };

  const axisLabelStyle = {
    fontSize: "14px", // Taille de la police du label
    fontFamily: "system-ui", // Police utilisée pour le label
    fill: "#555", // Couleur du texte du label
    fontWeight: "bold", // Épaisseur de la police
  };

  const COLOR_STROKE_ABOVE_TARGET = "red";
  const COLOR_STROKE_BELOW_TARGET = "green";
  const COLOR_FILL_ABOVE_TARGET = "rgba(239, 68, 68,0.5)"; // Soft red
  const COLOR_FILL_BELOW_TARGET = "rgba(34, 197, 94, 0.5)"; // Soft green
  const COLOR_TEXT_ABOVE_TARGET = "rgb(239, 68, 68)";
  const COLOR_TEXT_BELOW_TARGET = "rgb(34, 197, 94)";

  // Calculer la valeur maximale des targets et ajouter une marge
  const maxTarget = Math.max(...values.map((entry) => entry.target));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={values} barCategoryGap={14}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => date.split('-')[0]} // Affiche uniquement le jour du mois
          tick={axisTickStyle}
          label={{
            value: xLabel,
            position: "insideBottom",
            offset: -3, // Décalage par rapport à l'axe
            style: axisLabelStyle,
          }}
        />
        <YAxis
          domain={[0, Math.ceil(maxTarget * 1.1)]} // Ajouter une marge de 10 % au-dessus de la valeur max
          tick={axisTickStyle}
          label={{
            value: yLabel,
            angle: -90, // Orientation verticale
            position: "insideLeft", // Position du label
            offset: 10, // Décalage par rapport à l'axe
            style: axisLabelStyle,
          }}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Line for the target */}
        <Line type="monotone" dataKey="target" stroke="red" strokeWidth={2} />

        {/* Bars with dynamic color */}
        <Bar dataKey="value" barSize={30}>
          <LabelList
            dataKey="value"
            position="top"
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "system-ui", // Set the font to system-ui
            }}
            content={({ x, y, width, value, index }) => {
              const isAboveTarget = index !== undefined && Number(values[index]?.value || 0) >= Number(values[index]?.target || 0);
              const color = isAboveTarget ? COLOR_TEXT_ABOVE_TARGET : COLOR_TEXT_BELOW_TARGET; // Dark green or dark red
              const roundedValue = Math.round(Number(value)); // Round the value to the nearest integer

              // Center the label horizontally and vertically above the bar
              const centeredX = (Number(x) || 0) + Number(width) / 2; // Ensure x is cast to a number and provide a default value
              const adjustedY = Number(y) - 5; // Adjust vertically above the bar

              return (
                <text
                  x={centeredX}
                  y={adjustedY}
                  fill={color}
                  textAnchor="middle" // Center the text horizontally
                  style={{ fontFamily: "system-ui", fontSize: "12px" }} // Set the font to system-ui
                >
                  {roundedValue}
                </text>
              );
            }}
          />

          {values.map((entry, index) => {
            const isAboveTarget = Number(entry.value) >= Number(entry.target);
            const fillColor = isAboveTarget ? COLOR_FILL_ABOVE_TARGET : COLOR_FILL_BELOW_TARGET; // Soft green and red
            const strokeColor = isAboveTarget ? COLOR_STROKE_ABOVE_TARGET : COLOR_STROKE_BELOW_TARGET; // Dark green and dark red

            return (
              <Cell
                key={`cell-${index}`}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1} // Add a border with 1px width
              />
            );
          })}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default LongTermChartComponent;