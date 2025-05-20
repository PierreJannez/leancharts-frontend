import axios from 'axios';
import { Bundle } from '../types/Bundle'; // Import the shared interface

const API_BASE = "/api/tpl-bundles" 

export const fetchTplBundles = async (): Promise<Bundle[]> => {
    try {
        const response = await axios.get(API_BASE);
        return response.data.bundles || [];
    } catch (error) {
        console.error(`Eerror when retrieving predefined bundles.`, error);
        return [];
    }
};