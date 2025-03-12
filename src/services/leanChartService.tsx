import axios from 'axios';
import { LeanChart } from '../types/LeanChart'; // Import the shared interface

/**
 * Fetch all LeanChart for a specific bundle from the API.
 * @param bundleId The ID of the client
 * @returns A promise resolving to an array of LeanCharts
 */
export const fetchLeanCharts = async (bundleId: number): Promise<LeanChart[]> => {
    try {
        const response = await axios.get(`http://localhost:3000/bundles/${bundleId}/leancharts`);
        console.log("Réponse de l'API :", response.data.leancharts); // Vérifie ce que l'API retourne

        return response.data.leancharts || [];
    } catch (error) {
        console.error(`Erreur lors de la récupération des bundles pour le client ${bundleId}:`, error);
        return [];
    }
};
