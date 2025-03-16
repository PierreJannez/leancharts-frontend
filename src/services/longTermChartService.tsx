import axios from 'axios';
import { LongTermChart } from '../types/LongTermChart'; // Import the shared interface

/**
 * Fetch LongTermChart data from the API.
 * @param longTermChartId The ID of the long term chart
 * @returns A promise resolving to a LongTermChart object
 */
export const fetchLongTermChart = async (longTermChartId: number): Promise<LongTermChart> => {
    try {
        const response = await axios.get(`http://localhost:3000/longTermChart/${longTermChartId}/longTermChart`);
        console.log("Réponse de l'API :", response.data); // Vérifie ce que l'API retourne
        return response.data as LongTermChart;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour le graphique ${longTermChartId}:`, error);
        return {} as LongTermChart;
    }
};