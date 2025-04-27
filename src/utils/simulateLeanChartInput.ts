// utils/simulateLeanChartInput.ts

import { ChartData } from "@/types/LeanChart";

export const simulateLeanChartInput = async ({
  entries,
  onValueChange,
  startValue = 100,
  averageDecrement = 5,
  maxFluctuation = 10,
  delayMs = 500,
}: {
  entries: ChartData[];
  onValueChange: (entry: ChartData, newValue: number) => void;
  startValue?: number;
  averageDecrement?: number;
  maxFluctuation?: number;
  delayMs?: number;
}) => {
  const initialValues = entries.map((entry) => ({
    entry,
    originalValue: entry.value,
  }));

  let currentValue = startValue;

  for (const { entry } of initialValues) {
    const fluctuation = Math.floor((Math.random() - 0.5) * 2 * maxFluctuation); // fluctuation entière
    let simulatedValue = currentValue - averageDecrement + fluctuation;
    simulatedValue = Math.max(0, Math.round(simulatedValue)); // ENTIER et jamais négatif

    // Met à jour visuellement
    entry.value = simulatedValue;
    onValueChange(entry, simulatedValue);

    // Prépare la valeur suivante
    currentValue = simulatedValue;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  // Restaure les vraies valeurs
  for (const { entry, originalValue } of initialValues) {
    entry.value = originalValue;
    onValueChange(entry, originalValue);
  }
};