import axios from "axios"
import { TplChart } from "@/types/TplChart"

const API_BASE = "/api/tpl-charts"

export const fetchTplCharts = async (id_tpl_bundle: number, id_tpl_service: number): Promise<TplChart[]> => {
  try {
        const response = await axios.get(API_BASE, {
            params: { id_tpl_service, id_tpl_bundle },
        });
        return response.data.charts || [];
    } catch (error) {
        console.error(`Error when retrieving predefined charts.`, error);
        return [];
    }
}

// @/services/tplChartService.ts
export const importSelectedCharts = async (
  bundles: { bundle: string; charts: string[] }[],
  id_team: number
): Promise<{ message: string }> => {
  const API_BASE = "/api/tpl-charts/import-tpl-charts";

  try {
    const response = await axios.post(API_BASE, {
      bundles,
      id_team,
    });

    return response.data;
  } catch (error) {
    console.error("Error importing charts:", error);
    throw new Error("Failed to import selected charts");
  }
};