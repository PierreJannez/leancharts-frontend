import axios from "axios"
import { TplService } from "@/types/TplService"

const API_BASE = "/api/tpl-services" 

export const fetchTplServices = async (): Promise<TplService[]> => {  
    const res = await axios.get(API_BASE)
  
    console.log("serviceService.fetchTplServices => res.data", res.data as TplService[])
  
    return res.data as TplService[]
}

