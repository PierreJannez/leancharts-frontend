import React from 'react';
import GenericChartComponent from './GenericChartComponent';
import { LeanChart } from '../../types/LeanChart';
import { GenericChartInfo } from './GenericChartInfo';
import { parse, format, getISOWeek } from 'date-fns';
import { enUS } from "date-fns/locale";
import { groupByWeek } from "@/utils/groupByWeek";

interface Props {
  leanChart: LeanChart;
  currentMonth: string;
}

const formatMonthKeyToLabel = (monthKey: string): string => {
  const date = parse(monthKey, "yyyy-MM", new Date());
  return format(date, "MMMM yyyy", { locale: enUS });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WeeklyTooltip = ({ active, payload, nbDecimal }: any) => {
  if (active && payload && payload.length) {
    const { date, value, target, comment } = payload[0].payload;
    const start = format(new Date(date), 'MMM dd');
    const end = format(new Date(new Date(date).getTime() + 6 * 86400000), 'MMM dd');

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-sm text-gray-700 whitespace-pre-line">
        <p><strong>📅 Week:</strong> {start} to {end}</p>
        <p><strong>🎯 Target:</strong> {Number(target).toFixed(nbDecimal)}</p>
        <p><strong>📊 Value:</strong> {Number(value).toFixed(nbDecimal)}</p>
        {comment && <p><strong>📝 Comment:</strong> {comment}</p>}
      </div>
    );
  }
  return null;
};

const WeeklyShortTermChart: React.FC<Props> = ({ leanChart, currentMonth }) => {
  const weeklyValues = groupByWeek(leanChart.shortTermData);

  const genericChartInfo: GenericChartInfo = {
    title: `${leanChart.shortTermTitle} ${formatMonthKeyToLabel(currentMonth)}`,
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values: weeklyValues,
    nbDecimal: leanChart.nbDecimal || 0,
    positiveColor: leanChart.positiveColor || '#22C55E',
    negativeColor: leanChart.negativeColor || '#EF4444',
    isPositiveColorAboveTarget: leanChart.isPositiveColorAboveTarget,
  };

  const weekTickFormatter = (date: string) => {
    const d = new Date(date);
    return `W${getISOWeek(d)}`;
  };

  return (
    <GenericChartComponent
    genericChartInfo={genericChartInfo}
    tickFormatter={weekTickFormatter}
    customTooltip={(props) => <WeeklyTooltip {...props} nbDecimal={genericChartInfo.nbDecimal} />}
  />
);
};

export default WeeklyShortTermChart;
