import api from "./axiosConfig";

export const getGrupos = () => api.get("/grupos");
export const getGrupo = (id) => api.get(`/grupos/${id}`);
export const createGrupo = (data) => api.post("/grupos", data);
export const updateGrupo = (id, data) => api.patch(`/grupos/${id}`, data);
export const deleteGrupo = (id) => api.delete(`/grupos/${id}`);