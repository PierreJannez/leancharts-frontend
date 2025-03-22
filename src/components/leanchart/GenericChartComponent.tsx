import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { GenericChartInfo } from "./GenericChartInfo";
import { colord } from "colord";

interface GenericChartComponentProps {
  genericChartInfo: GenericChartInfo;
  tickFormatter: (value: string) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, nbDecimal }: any) => {
  if (active && payload && payload.length) {
    const { date, value, target, comment } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-sm text-gray-700">
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Value:</strong> {Number(value).toFixed(nbDecimal)}</p>
        <p><strong>Target:</strong> {Number(target).toFixed(nbDecimal)}</p>
        <p><strong>Comment:</strong> {comment || "No comment"}</p>
      </div>
    );
  }
  return null;
};

const GenericChartComponent: React.FC<GenericChartComponentProps> = ({ genericChartInfo, tickFormatter }) => {
  if (!genericChartInfo) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

console.log("genericChartInfo.nbDecimal=", genericChartInfo.nbDecimal);

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

  const COLOR_FILL_ABOVE_TARGET = colord(genericChartInfo.negativeColor).alpha(0.5).toRgbString();
  const COLOR_FILL_BELOW_TARGET = colord(genericChartInfo.positiveColor).alpha(0.5).toRgbString();
  const COLOR_TEXT_ABOVE_TARGET = colord(genericChartInfo.negativeColor).alpha(1).toRgbString();
  const COLOR_TEXT_BELOW_TARGET = colord(genericChartInfo.positiveColor).alpha(1).toRgbString();

  const maxTarget = Math.max(...genericChartInfo.values.map((entry) => entry.target));
  const yAxisMax = Math.ceil(maxTarget * 1.1);
  const nbDecimal = genericChartInfo.nbDecimal ?? 1;

  return (
    <div>
      <h2 className="text-center text-lg font-bold text-gray-700 mb-4" style={{ fontSize: 16, fontFamily: "system-ui", color: "#333" }}>
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
          <Tooltip content={(props) => <CustomTooltip {...props} nbDecimal={nbDecimal} />} />
          <Line type="monotone" dataKey="target" stroke="red" strokeWidth={2} />
          <Bar dataKey="value" barSize={30}>
            <LabelList
              dataKey="value"
              position="top"
              style={{ fontSize: "12px", fontWeight: "bold", fontFamily: "system-ui" }}
              content={({ x, y, width, value, index }) => {
                const isAboveTarget = index !== undefined && Number(genericChartInfo.values[index]?.value || 0) >= Number(genericChartInfo.values[index]?.target || 0);
                const color = isAboveTarget ? COLOR_TEXT_ABOVE_TARGET : COLOR_TEXT_BELOW_TARGET;
                const roundedValue = Number(value).toFixed(nbDecimal);
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

export default GenericChartComponent;
