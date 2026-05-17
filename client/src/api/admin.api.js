import api from "./axios.js";

const getAdminOverview = async () => {
  const res = await api.get("/admin/overview");
  return res.data;
};

export { getAdminOverview };
