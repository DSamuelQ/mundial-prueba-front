import api from "./axiosConfig";

export const getClientes = () => api.get("/clientes");
export const createCliente = (data) => api.post("/clientes", data);
