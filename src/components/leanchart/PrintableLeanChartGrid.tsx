// ✅ PrintableLeanChartGrid – rendu invisible mais dans le viewport (fix Chart.js rendering)

import React from "react";
import { LeanChart } from "../../types/LeanChart";
import CumulativeShortTermChartComponent from "./CumulativeShortTermChart";
import ShortTermChartComponent from "./ShortTermChartComponent";

interface PrintableLeanChartGridProps {
  leanCharts: LeanChart[];
  currentMonth: string;
}

const PrintableLeanChartGrid = React.forwardRef<HTMLDivElement, PrintableLeanChartGridProps>(
  ({ leanCharts, currentMonth }, ref) => {
    return (
<div
  ref={ref}
  style={{
    display: "block",         // visible !
    backgroundColor: "white",
  }}
>
  {leanCharts.map((chart) => {
    const ChartComponent = chart.UXComponent === "CumulativeLeanChart"
      ? CumulativeShortTermChartComponent
      : ShortTermChartComponent;

    return (
      <div
        key={`print-${chart.id}`}
        style={{
          width: "1122px",              // = 297mm
          height: "794px",              // = 210mm
          pageBreakAfter: "always",
          padding: "40px",
          boxSizing: "border-box",
          backgroundColor: "white",
        }}
      >
        <ChartComponent
          leanChart={chart}
          currentMonth={currentMonth}
          tickFormatter={(date) => date.split("-")[0]}
        />
      </div>
    );
  })}
</div>    );
  }
);

PrintableLeanChartGrid.displayName = "PrintableLeanChartGrid";
export default PrintableLeanChartGrid;
