export interface ChartData {
    date: string;
    target: number;
    value: number;
    comment: string;
  }
  
  export interface ChartDescription {
    id: number;
    title: string;
    xLabel: string;
    yLabel: string;
    mainTarget: number;
    values: ChartData[];
  }

  export interface LeanChartData {
    longTermChart: ChartDescription;
    shortTermChart: ChartDescription;
  }
  