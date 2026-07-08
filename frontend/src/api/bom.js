import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const getBom = (productId) => API.get(`/products/${productId}/bom`);
export const addBomItem = (productId, data) => API.post(`/products/${productId}/bom`, data);
export const updateBomItem = (id, data) => API.put(`/bom-items/${id}`, data);
export const deleteBomItem = (id) => API.delete(`/bom-items/${id}`);