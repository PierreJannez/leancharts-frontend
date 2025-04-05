import axios from "axios"
import { Team } from "@/types/Team"

const API_BASE = "/api/teams"

export const fetchTeams = async (id_service: number): Promise<Team[]> => {
  const res = await axios.get(API_BASE, {
    params: { id_service },
  })
  return res.data
}

export const createTeam = async (team: Omit<Team, "id">): Promise<Team> => {
  const res = await axios.post(API_BASE, team)
  return res.data
}

export const updateTeam = async (team: Team): Promise<Team> => {
  const res = await axios.put(`${API_BASE}/${team.id}`, team)
  return res.data
}

export const deleteTeam = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`)
}