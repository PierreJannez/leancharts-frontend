import axios from "axios";

export const setupTeam = async (
  serviceName: string,
  teamName: string
): Promise<{ id_service: number; id_team: number }> => {
  const res = await axios.post("/api/setup-team", {
    serviceName,
    teamName,
  });
  return res.data;
};