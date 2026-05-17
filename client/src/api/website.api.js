import api from "./axios.js";

const getWebsites = async () => {
  const res = await api.get("/websites");
  return res.data;
};

const createWebsite = async (data) => {
  const res = await api.post("/websites", data);
  return res.data;
};

const updateWebsite = async (websiteId, data) => {
  const res = await api.patch(`/websites/${websiteId}`, data);
  return res.data;
};

const deleteWebsite = async (websiteId) => {
  const res = await api.delete(`/websites/${websiteId}`);
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

const getCompetitorAnalysis = async (websiteId) => {
  const res = await api.get(`/websites/${websiteId}/competitors`);
  return res.data;
};

const getReportExportUrl = (websiteId, format = "html") =>
  `${api.defaults.baseURL}/websites/${websiteId}/export?format=${format}`;

export {
  createWebsite,
  deleteWebsite,
  getCompetitorAnalysis,
  getReportExportUrl,
  getSeoReports,
  getWebsites,
  runSeoAudit,
  updateWebsite,
};
