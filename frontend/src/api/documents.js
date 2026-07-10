import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const getDocuments = (productId) => API.get(`/products/${productId}/documents`);
export const uploadDocument = (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/products/${productId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const deleteDocument = (id) => API.delete(`/documents/${id}`);