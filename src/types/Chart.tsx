export interface Chart {
  id: number;
  name: string;
  icon: string;
  xLabel: string;
  yLabel: string;
  mainTarget: number;
  isMonthly: boolean;
  isCumulative: boolean;
  isPositiveColorAbove: boolean;
  positiveColor: string;
  negativeColor: string;
}

