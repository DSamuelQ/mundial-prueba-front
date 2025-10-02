import api from "./axiosConfig";

// Registrar usuario
export const registrarUsuario = (data) => api.post("/usuarios/registro", data);

// Login usuario
export const loginUsuario = (data) => api.post("/usuarios/login", data);

// Obtener todos los usuarios
export const getUsuarios = () => api.get("/usuarios");

// Actualizar usuario
export const updateUsuario = (id, data) => api.put(`/usuarios/${id}`, data);

// Eliminar usuario
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}`);
