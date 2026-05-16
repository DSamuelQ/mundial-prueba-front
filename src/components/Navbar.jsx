import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-cyan-600 text-white px-8 py-4 flex justify-between items-center shadow-md mb-8 rounded-b-lg">
      <div className="flex gap-8 items-center">
        <span className="font-bold text-xl tracking-wide">Sorteo Muncial</span>
        <Link to="/pedidos" className="hover:bg-cyan-700 px-3 py-2 rounded transition">Pedidos</Link>
        <Link to="/" className="hover:bg-cyan-700 px-3 py-2 rounded transition">Clientes</Link>
        <Link to="/usuarios" className="hover:bg-cyan-700 px-3 py-2 rounded transition">Usuarios</Link>
        <Link to="/reportes" className="hover:bg-cyan-700 px-3 py-2 rounded transition">Reportes</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">👤 {user.nombre} ({user.rol && user.rol.nombreRol})</span>
        <button
          onClick={handleLogout}
          className="bg-white text-cyan-700 hover:bg-cyan-100 px-3 py-1 rounded font-semibold transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}