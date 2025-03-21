
export interface ChartData {
  date: string;
  target: number;
  value: number;
  comment: string;
}

export interface LeanChart {
  id: number; 
  UXComponent: string;
  name: string; 
  icon:string;
  isCumulative:boolean;
  isPositiveColorAboveTarget:boolean;
  negativeColor:string;
  positiveColor:string;
  longTermTitle:string;
  longTermxLabel:string;
  longTermyLabel:string;
  longTermMainTarget:number;
  shortTermTitle:string;
  shortTermxLabel:string;
  shortTermyLabel:string;
  shortTermMainTarget:number;
  displayOrder:number; 
  longTermData: ChartData[];
  shortTermData: ChartData[];
  cumulLongTermData: number[];
  cumulShortTermData: number[];
}

export interface LeanChartData {
  longTermValues: ChartData[];
  shortTermValues: ChartData[];
}
