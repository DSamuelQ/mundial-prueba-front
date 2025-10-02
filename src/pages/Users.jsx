import { useEffect, useState } from "react";
import { getUsuarios, registrarUsuario, updateUsuario, deleteUsuario } from "../api/usuarios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ usuario: "", nombre: "", apellido: "", password: "", rol: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cargarUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsers(res.data);
    } catch (err) {
      setError("Error al cargar usuarios");
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editId) {
        // Editar usuario
        await updateUsuario(editId, form);
      } else {
        // Crear usuario
        await registrarUsuario(form);
      }
      setForm({ usuario: "", nombre: "", apellido: "", password: "", rol: "" });
      setEditId(null);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      usuario: user.usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      password: "", // No se muestra la contraseña actual
      rol: user.rol?.nombreRol || user.rol || ""
    });
    setEditId(user.id_usuario);
    setError("");
  };

  const handleCancelEdit = () => {
    setForm({ usuario: "", nombre: "", apellido: "", password: "", rol: "" });
    setEditId(null);
    setError("");
  };

  return (
    <div className="container py-4">
      <h1>Usuarios</h1>
      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Usuario" value={form.usuario}
              onChange={e => setForm({ ...form, usuario: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Apellido" value={form.apellido}
              onChange={e => setForm({ ...form, apellido: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Contraseña" type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required={!editId} />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Rol" value={form.rol}
              onChange={e => setForm({ ...form, rol: e.target.value })} required />
          </div>
          <div className="col-md-4 d-grid">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Guardando..." : editId ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
        {editId && (
          <div className="mt-2">
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
              Cancelar edición
            </button>
          </div>
        )}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id_usuario}>
                    <td>{u.usuario}</td>
                    <td>{u.nombre}</td>
                    <td>{u.apellido}</td>
                    <td>{u.rol?.nombreRol || u.rol || ""}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(u)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={async () => { await deleteUsuario(u.id_usuario); cargarUsuarios(); }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
