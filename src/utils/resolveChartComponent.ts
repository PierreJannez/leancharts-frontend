import { LeanChart } from "@/types/LeanChart";
import ShortTermChartComponent from "@/components/leanchart/ShortTermChartComponent";
import CumulativeShortTermChart from "@/components/leanchart/CumulativeShortTermChart";
import WeeklyShortTermChart from "@/components/leanchart/WeeklyShortTermChart";
import { FC } from "react";

export type LeanChartChartComponent = FC<{
  leanChart: LeanChart;
  currentMonth: string;
  tickFormatter: (v: string) => string;
}>;

/**
 * Retourne un état logique simplifié (machine à état implicite).
 */
function resolveChartState(leanChart: LeanChart): "weekly" | "cumulative" | "standard" {
  if (leanChart.periodicity === "weekly") return "weekly";
  if (leanChart.isCumulative ) return "cumulative";
  return "standard";
}

/**
 * Machine à état : retourne le bon composant graphique en fonction d’un LeanChart.
 */
export function resolveChartComponent(leanChart: LeanChart): LeanChartChartComponent {
  switch (resolveChartState(leanChart)) {
    case "weekly":
      return WeeklyShortTermChart;
    case "cumulative":
      return CumulativeShortTermChart;
    case "standard":
    default:
      return ShortTermChartComponent;
  }
}