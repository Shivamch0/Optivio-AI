import api from "./axios.js";

const createCheckout = async (plan) => {
  const res = await api.post("/billing/checkout", { plan });
  return res.data;
};

const getBillingHistory = async () => {
  const res = await api.get("/billing/history");
  return res.data;
};

export { createCheckout, getBillingHistory };
