import api from "./axiosConfig";

export const getEquipos = () => api.get("/equipos");
export const getEquipo = (id) => api.get(`/equipos/${id}`);
export const createEquipo = (data) => api.post("/equipos", data);
export const updateEquipo = (id, data) => api.patch(`/equipos/${id}`, data);
export const deleteEquipo = (id) => api.delete(`/equipos/${id}`);