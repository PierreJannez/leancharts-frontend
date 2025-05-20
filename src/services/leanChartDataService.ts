import axios from 'axios';
import { LeanChartData, ChartData} from '../types/LeanChart'; // Import the shared interface

const getLastThreeMonthsData = (): ChartData[] => {
  const result: ChartData[] = [];
  const now = new Date();

  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const day = String(d.getDate()).padStart(2, "0");      // toujours "01" ici
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    result.push({
      date: `${day}-${month}-${year}`, // ← format dd-mm-yyyy
      value: 0,
      target: 0,
      comment: "",
    });
  }

  return result;
};

/**
 * Fetch LongTermChart data from the API.
 * @param leanChartId The ID of the lean chart
 * @returns A promise resolving to a LongTermChart object
 */
export const fetchLeanChartData = async (
  leanChartId: number,
  month: string // <-- nouveau paramètre au format "2024-04"
): Promise<LeanChartData> => {
  try {
    const response = await axios.get(`/api/leanChartData/${leanChartId}/leanChartData`, {
      params: { month }
    });

    const leanChartData: LeanChartData = response.data;

    // Forcer la conversion en nombre pour chaque champ `value` et `target`
    leanChartData.shortTermValues = leanChartData.shortTermValues.map((entry) => ({
      ...entry,
      value: Number(entry.value),
      target: Number(entry.target),
    }));

    leanChartData.longTermValues = leanChartData.longTermValues.map((entry) => ({
      ...entry,
      value: Number(entry.value),
      target: Number(entry.target),
    }));

    // Ensuite ta logique sur les mois manquants
    if (leanChartData.longTermValues.length === 0) {
      leanChartData.longTermValues = getLastThreeMonthsData();
    }

console.log("leanChartDataService->fetchLeanChartData->leanChartData", leanChartData);

    return leanChartData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour le graphique ${leanChartId}:`, error);
    return {} as LeanChartData;
  }
};

export const updateShortTermChartValue = async (chartId: number, date: string, newTarget:number, newValue: number, newComment: string) => {
    try {
      const response = await axios.post(`/api/shortTermValues`, { 
        chartId,
        date,
        target: newTarget,
        value: newValue,
        comment: newComment,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating short term chart value:", error);
      throw error;
    }
  };

  export const updateLongTermChartValue = async (chartId: number, date: string, newTarget:number, newValue: number, newComment: string) => {
    try {
      const response = await axios.post(`/api/longTermValues`, { 
        chartId,
        date,
        target: newTarget,
        value: newValue,
        comment: newComment,
      });      
      return response.data;
    } catch (error) {
      console.error("Error updating long term chart value:", error);
      throw error;
    }
  };