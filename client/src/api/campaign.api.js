import api from "./axios.js";

const getCampaigns = async () => {
  const res = await api.get("/campaigns");
  return res.data;
};

const generateCampaign = async (data) => {
  const res = await api.post("/campaigns/generate", data);
  return res.data;
};

const regenerateCampaign = async (campaignId) => {
  const res = await api.post(`/campaigns/${campaignId}/regenerate`);
  return res.data;
};

const toggleCampaignFavorite = async (campaignId, text) => {
  const res = await api.patch(`/campaigns/${campaignId}/favorites`, { text });
  return res.data;
};

const getCampaignExportUrl = (campaignId) =>
  `${api.defaults.baseURL}/campaigns/${campaignId}/export`;

export {
  generateCampaign,
  getCampaignExportUrl,
  getCampaigns,
  regenerateCampaign,
  toggleCampaignFavorite,
};
