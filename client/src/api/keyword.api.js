import api from "./axios.js";

const getKeywords = async (websiteId) => {
  const res = await api.get("/keywords", { params: { websiteId } });
  return res.data;
};

const analyzeKeyword = async (data) => {
  const res = await api.post("/keywords", data);
  return res.data;
};

const getKeywordSuggestions = async (websiteId, keyword) => {
  const res = await api.get("/keywords/suggestions", {
    params: { websiteId, keyword },
  });
  return res.data;
};

const deleteKeyword = async (keywordId) => {
  const res = await api.delete(`/keywords/${keywordId}`);
  return res.data;
};

export { analyzeKeyword, deleteKeyword, getKeywords, getKeywordSuggestions };
