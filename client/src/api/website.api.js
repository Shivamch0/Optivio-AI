import api from "./axios.js";

const getWebsites = async () => {
  const res = await api.get("/websites");
  return res.data;
};

const createWebsite = async (data) => {
  const res = await api.post("/websites", data);
  return res.data;
};

const runSeoAudit = async (websiteId) => {
  const res = await api.post(`/websites/${websiteId}/audits`);
  return res.data;
};

const getSeoReports = async (websiteId) => {
  const res = await api.get(`/websites/${websiteId}/audits`);
  return res.data;
};

export { createWebsite, getSeoReports, getWebsites, runSeoAudit };
