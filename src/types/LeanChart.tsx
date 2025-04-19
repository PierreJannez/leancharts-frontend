
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
  periodicity:string;
  isCumulative:boolean;
  isPositiveColorAboveTarget:boolean;
  negativeColor:string;
  positiveColor:string;
  nbDecimal:number;
  longTermTitle:string;
  longTermxLabel:string;
  longTermyLabel:string;
  longTermMainTarget:number;
  shortTermTitle:string;
  shortTermxLabel:string;
  shortTermyLabel:string;
  shortTermMainTarget:number;
  displayOrder:number;
  min:number;
  max:number; 
  longTermData: ChartData[];
  shortTermData: ChartData[];
  cumulLongTermData: number[];
  cumulShortTermData: number[];
}

export interface LeanChartData {
  longTermValues: ChartData[];
  shortTermValues: ChartData[];
}
