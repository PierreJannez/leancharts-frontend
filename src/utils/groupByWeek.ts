// utils/groupByWeek.ts
import { parse, startOfWeek, format } from "date-fns";
import { ChartData } from "../types/LeanChart";

export function groupByWeek(data: ChartData[]): ChartData[] {
  const weekMap = new Map<string, ChartData & { originalDate: string }>();

  data.forEach(({ date, value, target, comment }) => {
    const parsedDate = parse(date, "dd-MM-yyyy", new Date());
    if (isNaN(parsedDate.getTime())) return;

    const weekStart = format(startOfWeek(parsedDate, { weekStartsOn: 1 }), "yyyy-MM-dd");

    const numericValue = Number(value);
    const numericTarget = Number(target);

    const existing = weekMap.get(weekStart);
    if (existing) {
      existing.value += numericValue;
      existing.target += numericTarget;
      existing.comment += comment ? `\n${comment}` : '';
    } else {
      weekMap.set(weekStart, {
        date: weekStart,              // pour affichage
        originalDate: date,           // 👈 pour sauvegarde
        value: numericValue,
        target: numericTarget,
        comment: comment || "",
      });
    }
  });

  return Array.from(weekMap.values());
}