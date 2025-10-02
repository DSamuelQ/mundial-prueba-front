import { createContext, useContext, useState } from "react";
import { loginUsuario } from "../api/usuarios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (usuario, password) => {
    console.log("Llamando a loginUsuario API...");
    const res = await loginUsuario({ usuario, password });
    console.log("Respuesta de loginUsuario:", res.data);

    // El backend responde: { message: '...', usuario: { id_usuario, nombre, apellido, usuario, rol } }
    const usuarioObj = res.data?.usuario ?? res.data;

    // Normalizar rol:
    let rolNormalized;
    if (usuarioObj?.rol) {
      if (typeof usuarioObj.rol === "object") {
        // Si ya es objeto, intentar extraer nombreRol y forzar a minúsculas
        const raw = usuarioObj.rol.nombreRol ?? usuarioObj.rol.nombre ?? usuarioObj.rol;
        rolNormalized = { ...usuarioObj.rol, nombreRol: String(raw).toLowerCase() };
      } else {
        // Si viene como string/number -> guardamos como objeto con nombreRol en minúsculas
        rolNormalized = { nombreRol: String(usuarioObj.rol).toLowerCase() };
      }
    } else {
      rolNormalized = { nombreRol: "" };
    }

    const normalizedUser = {
      ...usuarioObj,
      rol: rolNormalized,
    };

    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    return normalizedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
