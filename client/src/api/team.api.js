import api from "./axios.js";

const getTeams = async () => {
  const res = await api.get("/teams");
  return res.data;
};

const createTeam = async (name) => {
  const res = await api.post("/teams", { name });
  return res.data;
};

const inviteMember = async (teamId, data) => {
  const res = await api.post(`/teams/${teamId}/invite`, data);
  return res.data;
};

const removeMember = async (teamId, email) => {
  const res = await api.delete(`/teams/${teamId}/members/${email}`);
  return res.data;
};

export { createTeam, getTeams, inviteMember, removeMember };
