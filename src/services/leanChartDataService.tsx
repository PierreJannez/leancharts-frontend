import axios from 'axios';
import { LeanChartData } from '../types/LeanChartData'; // Import the shared interface

/**
 * Fetch LongTermChart data from the API.
 * @param leanChartId The ID of the lean chart
 * @returns A promise resolving to a LongTermChart object
 */
export const fetchLeanChartData = async (leanChartId: number): Promise<LeanChartData> => {
    try {
        const response = await axios.get(`http://localhost:3000/leanChartData/${leanChartId}/leanChartData`);
        return response.data as LeanChartData;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour le graphique ${leanChartId}:`, error);
        return {} as LeanChartData;
    }
};