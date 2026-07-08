import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const getRouting = (productId) => API.get(`/products/${productId}/routing`);
export const addRoutingStep = (productId, data) => API.post(`/products/${productId}/routing`, data);
export const updateRoutingStep = (id, data) => API.put(`/routing-steps/${id}`, data);
export const deleteRoutingStep = (id) => API.delete(`/routing-steps/${id}`);