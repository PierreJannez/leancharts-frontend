import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GenericChartComponent from './GenericChartComponent';
import { LeanChart, ChartData } from '../../types/LeanChart';
import { GenericChartInfo } from './GenericChartInfo';

interface Props {
  leanChart: LeanChart;
  currentMonth: string;
  tickFormatter: (value: string) => string;
}

const CumulativeShortTermChart: React.FC<Props> = ({ leanChart, tickFormatter }) => {
  // Construction des données cumulées à partir du leanChart, en conservant tous les champs ChartData
  const cumulativeValues: ChartData[] = leanChart.shortTermData.reduce<ChartData[]>((acc, curr, index) => {
    const prevValue = index === 0 ? 0 : acc[index - 1].value;
    acc.push({
      date: curr.date,
      value: prevValue + curr.value,
      target: curr.target,
      comment: curr.comment || '',
    });
    return acc;
  }, []);

  const genericChartInfo: GenericChartInfo = {
    title: leanChart.shortTermTitle,
    xLabel: leanChart.shortTermxLabel,
    yLabel: leanChart.shortTermyLabel,
    values: cumulativeValues,
    nbDecimal: leanChart.nbDecimal || 0,
    positiveColor: leanChart.positiveColor || '#22C55E',
    negativeColor: leanChart.negativeColor || '#EF4444',
    isPositiveColorAboveTarget: leanChart.isPositiveColorAboveTarget,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{genericChartInfo.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <GenericChartComponent
          genericChartInfo={genericChartInfo}
          tickFormatter={tickFormatter}
        />
      </CardContent>
    </Card>
  );
};

export default CumulativeShortTermChart;
