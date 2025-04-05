// services/serviceService.ts
import axios from "axios"
import { Service } from "@/types/Service"

const API_BASE = "/api/services" // adapte si besoin

export const fetchServices = async (enterpriseId: number): Promise<Service[]> => {
    console.log("serviceService.fetchServices => enterpriseId", enterpriseId)
  
    const res = await axios.get(API_BASE, {
      params: { id_enterprise: enterpriseId },
    })
  
    console.log("serviceService.fetchServices => res.data", res.data as Service[])
  
    return res.data as Service[]
}

export const createService = async (service: Omit<Service, "id">): Promise<Service> => {
  const res = await axios.post(`${API_BASE}/create`, service)
  return res.data
}

export const updateService = async (service: Service): Promise<Service> => {
  const res = await axios.put(`${API_BASE}/update/${service.id}`, service)
  return res.data
}

export const deleteService = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/delete/${id}`)
}