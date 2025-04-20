import React from "react";
import { parse } from "date-fns";
import { getISOWeek } from "date-fns";
import { LeanChart } from "@/types/LeanChart";
import { GenericChartInfo } from "./GenericChartInfo";
import GenericChartComponent from "./GenericChartComponent";
import { formatMonthKeyToLabel } from "../../utils/DateUtils";

interface Props {
  leanChart: LeanChart;
  currentMonth: string;
  tickFormatter?: (value: string) => string;
}

const WeeklyShortTermChartComponent: React.FC<Props> = ({ leanChart, currentMonth }) => {
  const fridayData = leanChart.shortTermData.filter((entry) => {
    const parsed = parse(entry.date, "dd-MM-yyyy", new Date());
    return parsed.getDay() === 5; // Vendredi uniquement
  });

  const chartInfo: GenericChartInfo = {
    title: `${leanChart.shortTermTitle} ${formatMonthKeyToLabel(currentMonth)}`,
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values: fridayData,
    nbDecimal: leanChart.nbDecimal,
    positiveColor: leanChart.positiveColor,
    negativeColor: leanChart.negativeColor,
    isPositiveColorAboveTarget: leanChart.isPositiveColorAboveTarget,
  };

  const tickFormatter = (date: string) => {
    const parsed = parse(date, "dd-MM-yyyy", new Date());
    return `W${getISOWeek(parsed)}`;
  };

  return <GenericChartComponent genericChartInfo={chartInfo} tickFormatter={tickFormatter} />;
};

export default WeeklyShortTermChartComponent;
