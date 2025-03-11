import configData from "../config.json";
import { Bundle } from "../types/Bundle"; // Import the shared interface

/**
 * Fetch all bundles for the client.
 * @returns An array of Bundles
 */
export const fetchBundles = (): Bundle[] => {
  const client = configData.clients?.[0];
  return client?.bundles || []; // Return bundles or an empty array
};