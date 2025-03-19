import axios from 'axios';
import { LeanChartData } from '../types/LeanChartData'; // Import the shared interface

/**
 * Fetch LongTermChart data from the API.
 * @param leanChartId The ID of the lean chart
 * @returns A promise resolving to a LongTermChart object
 */
export const fetchLeanChartData = async (leanChartId: number): Promise<LeanChartData> => {
    try {
        const response = await axios.get(`/api/leanChartData/${leanChartId}/leanChartData`);
        return response.data as LeanChartData;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour le graphique ${leanChartId}:`, error);
        return {} as LeanChartData;
    }
};

export const updateChartValue = async (chartId: number, date: string, newTarget:number, newValue: number, newComment: string) => {
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
      console.error("Error updating chart value:", error);
      throw error;
    }
  };