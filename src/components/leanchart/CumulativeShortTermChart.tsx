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
  // Construction des données cumulées à partir du leanChart, en conservant tous les champs ChartData
  const cumulativeValues: ChartData[] = leanChart.shortTermData.reduce<ChartData[]>((acc, curr, index) => {
    const prevValue = index === 0 ? 0 : acc[index - 1].value;
    acc.push({
      date: curr.date,
      value: Number(prevValue) + Number(curr.value),
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
