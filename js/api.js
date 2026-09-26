import { CONFIG } from "./config.js";

async function request(action, params = {}, options = {}) {
  const url = new URL(CONFIG.API_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "text/plain;charset=utf-8" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) throw new Error(`API ${response.status}`);
  const data = await response.json();
  if (data.ok === false) throw new Error(data.message || "Error de API");
  return data;
}

export const api = {
  getPromotions: () => request("promotions"),
  getCategories: () => request("categories"),
  getProducts: (category = "all") => request("products", { category }),
  getFaq: () => request("faq"),
  getTechnicalSheet: (productId) => request("technicalSheet", { productId }),
  findBillingCustomer: (email) => request("billingLookup", { email }),
  createOrder: (order) => request("createOrder", {}, { method: "POST", body: { action: "createOrder", order } }),
  sendContact: (payload) => request("contact", {}, { method: "POST", body: { action: "contact", payload } })
};
