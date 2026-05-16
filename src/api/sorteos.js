import api from "./axiosConfig";

export const generateSorteoPreview = (data) => api.post("/sorteos/preview", data);
export const confirmSorteo = (data) => api.post("/sorteos/confirm", data);
export const getSorteos = () => api.get("/sorteos");
