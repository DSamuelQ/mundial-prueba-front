import { useEffect, useState } from "react";
import { getGrupos, createGrupo, updateGrupo, deleteGrupo } from "../api/grupos";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cargarGrupos = async () => {
    try {
      const res = await getGrupos();
      setGrupos(res.data);
    } catch (err) {
      console.error("Error cargando grupos:", err);
      setError("Error al cargar grupos");
    }
  };

  useEffect(() => {
    cargarGrupos();
  }, []);

  const validarFormulario = () => {
    if (!form.nombre?.trim()) {
      return "El nombre es obligatorio";
    }
    if (form.nombre.trim().length > 50) {
      return "El nombre no puede exceder 50 caracteres";
    }

    if (form.descripcion && form.descripcion.length > 175) {
      return "La descripción no puede exceder 175 caracteres";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validarFormulario();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim() || "",
      };

      if (editId) {
        await updateGrupo(editId, payload);
      } else {
        await createGrupo(payload);
      }

      setForm({ nombre: "", descripcion: "" });
      setEditId(null);
      cargarGrupos();
    } catch (err) {
      console.error("Error guardando grupo:", err);
      const msg = err.response?.data?.message || err.message || "Error al guardar grupo";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (g) => {
    setForm({
      nombre: g.nombre ?? "",
      descripcion: g.descripcion ?? "",
    });
    setEditId(g.id_grupo);
    setError("");
  };

  const handleCancelEdit = () => {
    setForm({ nombre: "", descripcion: "" });
    setEditId(null);
    setError("");
  };

  const handleDelete = async (g) => {
    const ok = window.confirm(`¿Eliminar el grupo "${g.nombre}"?`);
    if (!ok) return;

    try {
      await deleteGrupo(g.id_grupo);
      cargarGrupos();
    } catch (err) {
      console.error("Error eliminando grupo:", err);
      setError(err.response?.data?.message || "Error al eliminar grupo");
    }
  };

  return (
    <div className="container py-4">
      <h1>Grupos</h1>

      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Nombre (máx 50 caracteres)"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>

          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Descripción (máx 175 caracteres)"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <div className="col-md-3 d-grid">
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
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grupos.map((g) => (
                  <tr key={g.id_grupo}>
                    <td>{g.id_grupo}</td>
                    <td>{g.nombre}</td>
                    <td>{g.descripcion}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(g)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g)}>
                        Eliminar
                      </button>
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
