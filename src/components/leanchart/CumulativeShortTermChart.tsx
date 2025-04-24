import React from 'react';
import GenericChartComponent from './GenericChartComponent';
import { LeanChart, ChartData } from '../../types/LeanChart';
import { GenericChartInfo } from './GenericChartInfo';
import { parse, format } from "date-fns";
import { enUS } from "date-fns/locale";

interface Props {
  leanChart: LeanChart;
  currentMonth: string;
  tickFormatter: (value: string) => string;
}

const formatMonthKeyToLabel = (monthKey: string): string => {
  const date = parse(monthKey, "yyyy-MM", new Date());
  return format(date, "MMMM yyyy", { locale: enUS });
};

const CumulativeShortTermChart: React.FC<Props> = ({ leanChart, currentMonth, tickFormatter }) => {
  const type: "burnup" | "burndown" = leanChart.type === "burndown" ? "burndown" : "burnup";

  const cumulativeValues: ChartData[] = leanChart.shortTermData.reduce<ChartData[]>((acc, curr, index) => {
    const delta = Number(curr.value);
    const prevValue = index === 0 ? 0 : acc[index - 1].value;
  
    const value =
      type === "burnup"
        ? prevValue + delta
        : delta; // pas de cumul si ce n’est pas burnup
  
    acc.push({
      date: curr.date,
      value,
      target: curr.target,
      comment: curr.comment || '',
    });
  
    return acc;
  }, []);
  
  const genericChartInfo: GenericChartInfo = {
    title: `${leanChart.shortTermTitle} ${formatMonthKeyToLabel(currentMonth)}`,
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values: cumulativeValues,
    nbDecimal: leanChart.nbDecimal || 0,
    positiveColor: leanChart.positiveColor || '#22C55E',
    negativeColor: leanChart.negativeColor || '#EF4444',
    isPositiveColorAboveTarget: leanChart.isPositiveColorAboveTarget,
  };

  return (
    <GenericChartComponent
      genericChartInfo={genericChartInfo}
      tickFormatter={tickFormatter}
    />
  );
};

export default CumulativeShortTermChart;