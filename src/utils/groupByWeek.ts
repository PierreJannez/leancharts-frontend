// utils/groupByWeek.ts
import { parse, startOfWeek, format } from "date-fns";
import { ChartData } from "../types/LeanChart";

export interface ChartDataWithOriginal extends ChartData {
  originalDate: string;
}

export function groupByWeek(data: ChartData[]): ChartDataWithOriginal[] {
  const weekMap = new Map<string, ChartDataWithOriginal>();

  data.forEach(({ date, value, target, comment }) => {
    const parsedDate = parse(date, "dd-MM-yyyy", new Date());
    if (isNaN(parsedDate.getTime())) return;

    const weekStart = format(startOfWeek(parsedDate, { weekStartsOn: 1 }), "yyyy-MM-dd");

    const numericValue = Number(value);
    const numericTarget = Number(target);

    const existing = weekMap.get(weekStart);
    if (existing) {
      existing.value += numericValue;
      existing.comment += comment ? `\n${comment}` : '';
    } else {
      weekMap.set(weekStart, {
        date: weekStart,
        originalDate: date,
        value: numericValue,
        target: numericTarget,
        comment: comment || "",
      });
    }
  });

  return Array.from(weekMap.values());
}