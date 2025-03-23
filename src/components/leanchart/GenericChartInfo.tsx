import { ChartData } from '../../types/LeanChart'; // Import the shared type

export interface GenericChartInfo {
    title: string;
    xLabel: string;
    yLabel: string;
    values: ChartData[];
    nbDecimal: number;
    positiveColor: string;
    negativeColor: string;
    isPositiveColorAboveTarget: boolean;
}
