export interface ChartData {
    date: string;
    target: number;
    value: number;
    comment: string;
  }
  
  export interface LongTermChart {
    id: number;
    title: string;
    xLabel: string;
    yLabel: string;
    mainTarget: number;
    values: ChartData[];
  }