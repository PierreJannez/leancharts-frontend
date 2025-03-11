import configData from "../config.json";
import { Chart } from "../types/Chart";

/**
 * Fetch charts for a selected bundle.
 * @param selectedBundleId The ID of the selected bundle.
 * @returns An array of Charts
 */
export const fetchCharts = (selectedBundleId: number | null): Chart[] => {
  if (selectedBundleId === null) return [];

  const client = configData.clients?.[0];
  const selectedBundle = client?.bundles?.find((bundle) => bundle.id === selectedBundleId);
  
  return selectedBundle?.charts || []; // Return charts or an empty array
};