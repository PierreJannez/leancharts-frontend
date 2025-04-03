import axios from 'axios';
import { Bundle } from '../types/Bundle'; // Import the shared interface

/**
 * Fetch all bundles for a specific client from the API.
 * @param clientId The ID of the client
 * @returns A promise resolving to an array of Bundles
 */
export const fetchBundles = async (clientId: number): Promise<Bundle[]> => {
    try {
        const response = await axios.get(`/api/clients/${clientId}/bundles`);
        return response.data.bundles || [];
    } catch (error) {
        console.error(`Erreur lors de la récupération des bundles pour le client ${clientId}:`, error);
        return [];
    }
};

/**
 * Update a bundle.
 * @param bundle The bundle to update
 * @returns A promise resolving to the updated bundle
 */
export const updateBundle = async (bundle: Bundle): Promise<Bundle> => {
    try {
        const response = await axios.put(`/api/bundles/update/${bundle.id}`, bundle);
        return response.data.bundle;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du bundle ${bundle.id}:`, error);
        throw error;
    }
};

/**
 * Create a new bundle.
 * @param bundle The bundle to create (without id)
 * @param clientId The ID of the client this bundle is associated with
 * @returns A promise resolving to the created bundle
 */
export const createBundle = async (
    bundle: Omit<Bundle, "id">,
    clientId: number
  ): Promise<Bundle> => {
    try {
      const response = await axios.post(`/api/bundles/create`, {
        ...bundle,
        clientId,
      });
      return response.data.bundle;
    } catch (error) {
      console.error("Erreur lors de la création du bundle:", error);
      throw error;
    }
  };

/**
 * Delete a bundle by its ID.
 * The deletion will only succeed if the bundle has no associated LeanCharts.
 * @param bundleId The ID of the bundle to delete
 * @returns A promise resolving to a success message or throws on error
 */
export const deleteBundle = async (bundleId: number): Promise<void> => {
  try {
    await axios.delete(`/api/bundles/delete/${bundleId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du bundle ${bundleId}:`, error);
    throw error;
  }
};