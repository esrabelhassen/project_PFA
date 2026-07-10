import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const getPurchaseOrders = () => API.get("/purchase-orders");
export const generatePurchaseOrder = (productId) =>
  API.post(`/purchase-orders/generate/${productId}`);
export const updatePurchaseOrderStatus = (id, status) =>
  API.put(`/purchase-orders/${id}/status`, { status });