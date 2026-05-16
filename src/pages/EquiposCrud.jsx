import { useEffect, useMemo, useState } from "react";
import { getEquipos, createEquipo, updateEquipo, deleteEquipo } from "../api/equipos";
import { getGrupos } from "../api/grupos";

export default function EquiposCrud() {
  const [equipos, setEquipos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [form, setForm] = useState({
    nombre_pais: "",
    codigo_fifa: "",
    ranking_fifa: "",
    director_tecnico: "",
    cant_jugadores: "",
    id_grupo: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const gruposById = useMemo(() => {
    const map = new Map();
    for (const g of grupos) map.set(String(g.id_grupo), g);
    return map;
  }, [grupos]);

  const cargar = async () => {
    try {
      const [resEquipos, resGrupos] = await Promise.all([getEquipos(), getGrupos()]);
      setEquipos(resEquipos.data);
      setGrupos(resGrupos.data);
    } catch (err) {
      console.error("Error cargando equipos/grupos:", err);
      setError("Error al cargar datos");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const validarFormulario = () => {
    if (!form.nombre_pais?.trim()) {
      return "El nombre del país es obligatorio";
    }
    if (form.nombre_pais.trim().length > 75) {
      return "El nombre del país no puede exceder 75 caracteres";
    }

    if (!form.codigo_fifa?.trim()) {
      return "El código FIFA es obligatorio";
    }
    if (!/^[A-Za-z]{3}$/.test(form.codigo_fifa)) {
      return "El código FIFA debe ser exactamente 3 letras (A-Z)";
    }

    if (form.ranking_fifa === "" || isNaN(form.ranking_fifa)) {
      return "El ranking FIFA debe ser un número";
    }

    if (form.director_tecnico && form.director_tecnico.length > 125) {
      return "El director técnico no puede exceder 125 caracteres";
    }

    if (form.cant_jugadores === "" || isNaN(form.cant_jugadores)) {
      return "La cantidad de jugadores debe ser un número";
    }
    const cantNum = Number(form.cant_jugadores);
    if (cantNum < 23 || cantNum > 26) {
      return "La cantidad de jugadores debe estar entre 23 y 26";
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
        nombre_pais: form.nombre_pais.trim(),
        codigo_fifa: form.codigo_fifa.toUpperCase(),
        ranking_fifa: Number(form.ranking_fifa),
        director_tecnico: form.director_tecnico?.trim() || "",
        cant_jugadores: Number(form.cant_jugadores),
      };

      if (editId) {
        await updateEquipo(editId, payload);
      } else {
        await createEquipo(payload);
      }

      setForm({
        nombre_pais: "",
        codigo_fifa: "",
        ranking_fifa: "",
        director_tecnico: "",
        cant_jugadores: "",
        id_grupo: "",
      });
      setEditId(null);
      cargar();
    } catch (err) {
      console.error("Error guardando equipo:", err);
      const msg = err.response?.data?.message || err.message || "Error al guardar equipo";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resolveEquipoGrupoId = (equipo) => {
    // Intentamos soportar diferentes shapes que puede devolver la API
    if (equipo?.grupo?.id_grupo != null) return String(equipo.grupo.id_grupo);
    if (equipo?.id_grupo != null) return String(equipo.id_grupo);
    if (equipo?.grupoId != null) return String(equipo.grupoId);
    return "";
  };

  const handleEdit = (e) => {
    setForm({
      nombre_pais: e.nombre_pais ?? "",
      codigo_fifa: e.codigo_fifa ?? "",
      ranking_fifa: e.ranking_fifa ?? "",
      director_tecnico: e.director_tecnico ?? "",
      cant_jugadores: e.cant_jugadores ?? "",
      id_grupo: resolveEquipoGrupoId(e),
    });
    setEditId(e.id_equipo);
    setError("");
  };

  const handleCancelEdit = () => {
    setForm({
      nombre_pais: "",
      codigo_fifa: "",
      ranking_fifa: "",
      director_tecnico: "",
      cant_jugadores: "",
      id_grupo: "",
    });
    setEditId(null);
    setError("");
  };

  const handleDelete = async (equipo) => {
    const ok = window.confirm(`¿Eliminar el equipo "${equipo.nombre_pais}"?`);
    if (!ok) return;

    try {
      await deleteEquipo(equipo.id_equipo);
      cargar();
    } catch (err) {
      console.error("Error eliminando equipo:", err);
      setError(err.response?.data?.message || "Error al eliminar equipo");
    }
  };

  const grupoLabel = (equipo) => {
    const id = resolveEquipoGrupoId(equipo);
    const g = id ? gruposById.get(id) : null;
    if (equipo?.grupo?.nombre) return equipo.grupo.nombre;
    if (g?.nombre) return g.nombre;
    return id ? `#${id}` : "—";
  };

  return (
    <div className="container py-4">
      <h1>Equipos</h1>

      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Nombre país"
              value={form.nombre_pais}
              pattern="^[a-zA-Z\s\-]+$"
              onChange={(e) => setForm({ ...form, nombre_pais: e.target.value })}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("El nombre del país solo puede contener letras, espacios y guiones")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Código FIFA"
              maxLength={3}
              pattern="^[a-zA-Z]+$"
              value={form.codigo_fifa}
              onChange={(ev) => setForm({ ...form, codigo_fifa: ev.target.value })}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("El código FIFA debe tener máximo 3 caracteres y solo puede contener letras")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Ranking"
              type="number"
              value={form.ranking_fifa}
              onChange={(ev) => setForm({ ...form, ranking_fifa: ev.target.value })}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Director técnico"
              pattern="^[a-zA-Z\s\-]+$"
              value={form.director_tecnico}
              onChange={(ev) => setForm({ ...form, director_tecnico: ev.target.value })}
              onInvalid={(e) =>
                e.target.setCustomValidity("El nombre del director técnico solo puede contener letras, espacios y guiones")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Jugadores (23-26)"
              type="number"
              min="23"
              max="26"
              value={form.cant_jugadores}
              onChange={(ev) => setForm({ ...form, cant_jugadores: ev.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={form.id_grupo}
              onChange={(ev) => setForm({ ...form, id_grupo: ev.target.value })}
            >
              <option value="">Sin grupo</option>
              {grupos.map((g) => (
                <option key={g.id_grupo} value={g.id_grupo}>
                  {g.nombre}
                </option>
              ))}
            </select>
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
                  <th>País</th>
                  <th>Código</th>
                  <th>Ranking</th>
                  <th>DT</th>
                  <th>Jugadores</th>
                  <th>Grupo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map((e) => (
                  <tr key={e.id_equipo}>
                    <td>{e.id_equipo}</td>
                    <td>{e.nombre_pais}</td>
                    <td>{e.codigo_fifa}</td>
                    <td>{e.ranking_fifa}</td>
                    <td>{e.director_tecnico}</td>
                    <td>{e.cant_jugadores}</td>
                    <td>{grupoLabel(e)}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(e)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e)}>
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
