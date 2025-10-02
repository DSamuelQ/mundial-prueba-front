import api from "./axiosConfig";

export const getPedidos = () => api.get("/pedidos");
export const getPedidoById = (id) => api.get(`/pedidos/${id}`);
export const getEstadisticas = () => api.get("/pedidos/estadisticas");
