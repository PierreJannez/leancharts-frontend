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
import { TooltipProps } from 'recharts'; // 👈 à ajouter en haut

interface GenericChartComponentProps {
  genericChartInfo: GenericChartInfo;
  tickFormatter: (value: string) => string;
  customTooltip?: (props: TooltipProps<number, string>) => React.ReactNode;
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

const GenericChartComponent: React.FC<GenericChartComponentProps> = ({ genericChartInfo, tickFormatter, customTooltip }) => {
  if (!genericChartInfo) {
    return <p className="text-center text-gray-500">No graph available</p>;
  }

  console.log(genericChartInfo);

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

  const COLOR_FILL_NEGATIVE_TARGET = colord(genericChartInfo.negativeColor).alpha(0.5).toRgbString();
  const COLOR_FILL_POSITIVE_TARGET = colord(genericChartInfo.positiveColor).alpha(0.5).toRgbString();
  const COLOR_TEXT_NEGATIVE_TARGET = colord(genericChartInfo.negativeColor).alpha(1).toRgbString();
  const COLOR_TEXT_POSITIVE_TARGET = colord(genericChartInfo.positiveColor).alpha(1).toRgbString();

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
          <Tooltip
            content={(props) =>
              customTooltip ? CustomTooltip(props) : <CustomTooltip {...props} nbDecimal={nbDecimal} />
            }
          />
          <Line type="monotone" dataKey="target" stroke="red" strokeWidth={2} />
          <Bar dataKey="value" barSize={30}>
            <LabelList
              dataKey="value"
              position="top"
              style={{ fontSize: "12px", fontWeight: "bold", fontFamily: "system-ui" }}
              content={({ x, y, width, value, index }) => {
                const isAboveTarget = index !== undefined && Number(genericChartInfo.values[index]?.value || 0) >= Number(genericChartInfo.values[index]?.target || 0);
                let color = COLOR_TEXT_POSITIVE_TARGET;
                if (genericChartInfo.isPositiveColorAboveTarget) {
                  color = isAboveTarget ? COLOR_TEXT_POSITIVE_TARGET : COLOR_TEXT_NEGATIVE_TARGET;
                } else {
                  color = isAboveTarget ? COLOR_TEXT_NEGATIVE_TARGET : COLOR_TEXT_POSITIVE_TARGET;
                }
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
            {genericChartInfo.values.map((_entry, index) => {
              const isAboveTarget = index !== undefined && Number(genericChartInfo.values[index]?.value || 0) >= Number(genericChartInfo.values[index]?.target || 0);
              let fillColor = COLOR_FILL_POSITIVE_TARGET;
              let strokeColor = "green";

              if (genericChartInfo.isPositiveColorAboveTarget) {
                if (isAboveTarget) {
                  fillColor = COLOR_FILL_POSITIVE_TARGET;
                  strokeColor = "green";
                } else {
                  fillColor = COLOR_FILL_NEGATIVE_TARGET;
                  strokeColor = "red";
                }
              } else {
                if (isAboveTarget) {
                  fillColor = COLOR_FILL_NEGATIVE_TARGET;
                  strokeColor = "red";
                } else {
                  fillColor = COLOR_FILL_POSITIVE_TARGET;
                  strokeColor = "green";
                }
              }
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
