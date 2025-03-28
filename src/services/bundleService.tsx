import axios from 'axios';
import { Bundle } from '../types/Bundle'; // Import the shared interface

/**
 * Fetch all bundles for a specific client from the API.
 * @param clientId The ID of the client
 * @returns A promise resolving to an array of Bundles
 */
export const fetchBundles = async (clientId: number): Promise<Bundle[]> => {
    try {
        console.log("clientId dans fetchBundles :", clientId);
        const response = await axios.get(`/api/clients/${clientId}/bundles`);
        return response.data.bundles || [];
    } catch (error) {
        console.error(`Erreur lors de la récupération des bundles pour le client ${clientId}:`, error);
        return [];
    }
};
