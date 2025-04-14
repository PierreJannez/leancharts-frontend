import axios from 'axios';
import { LeanChart } from '../types/LeanChart'; // Import the shared interface

/**
 * Fetch all LeanCharts for a specific bundle from the API.
 * @param bundleId The ID of the bundle
 * @returns A promise resolving to an array of LeanCharts
 */
export const fetchLeanCharts = async (bundleId: number): Promise<LeanChart[]> => {
  try {
    const response = await axios.get(`/api/leancharts/${bundleId}/leancharts`);
    console.log("Réponse de l'API => fetchLeanCharts :", response.data.leancharts as LeanChart[]);

    // Ajoute shortTermData et longTermData comme tableaux vides si non présents
    return (response.data.leancharts as LeanChart[] || []).map(chart => ({
      ...chart,
      shortTermData: chart.shortTermData || [],
      longTermData: chart.longTermData || []
    }));
  } catch (error) {
    console.error(`Error retrieving LeanCharts for the bundle ${bundleId}:`, error);
    return [];
  }
};

/**
 * Met à jour un LeanChart.
 * @param chart Le LeanChart à enregistrer
 */
export const updateLeanChart = async (chart: LeanChart): Promise<LeanChart> => {

  const payload = {
    ...chart
  };

  try {
    console.log("Payload de la requête PUT : ", payload);
    const response =await axios.put(`/api/leancharts/update/${chart.id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating LeanChart:", error);
    throw error;
  }
};

/**
 * Enregistre à jour un LeanChart.
 * @param chart Le LeanChart à enregistrer
 * @param bundleId L’ID du bundle auquel il est associé
 */
export const createLeanChart = async (chart: LeanChart, bundleId: number): Promise<LeanChart> => {

  const payload = {
    ...chart,
    bundleId, // au cas où le backend en a besoin
  };

  try {
    const response =await axios.put(`/api/leancharts/create/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error when saving the LeanChart:", error);
    throw error;
  }
};

/**
 * Supprime un LeanChart.
 * Cette opération supprime également ses données associées et le lien avec le bundle.
 * @param leanChartId L’ID du LeanChart à supprimer
 */
export const deleteLeanChart = async (leanChartId: number): Promise<void> => {
  try {
    await axios.delete(`/api/leancharts/delete/${leanChartId}`);
  } catch (error) {
    console.error(`Error deleting LeanChart ${leanChartId}:`, error);
    throw error;
  }
};