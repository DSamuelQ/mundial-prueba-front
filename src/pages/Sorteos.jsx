import { useEffect, useState } from "react";
import { generateSorteoPreview, confirmSorteo } from "../api/sorteos";
import { getGrupos } from "../api/grupos";
import { getEquipos } from "../api/equipos";

export default function Sorteos() {
  const [grupos, setGrupos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cantidadGrupos, setCantidadGrupos] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmingLoading, setConfirmingLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resGrupos, resEquipos] = await Promise.all([getGrupos(), getEquipos()]);
      setGrupos(resGrupos.data);
      setEquipos(resEquipos.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar datos");
    }
  };

  const validarPreview = () => {
    if (cantidadGrupos === "" || isNaN(cantidadGrupos)) {
      return "La cantidad de grupos debe ser un número";
    }
    const qty = Number(cantidadGrupos);
    if (qty < 2) {
      return "La cantidad de grupos debe ser mayor o igual a 2";
    }
    if (qty > grupos.length) {
      return `No hay suficientes grupos en BD (tienes ${grupos.length})`;
    }
    if (equipos.length === 0) {
      return "No hay equipos en BD";
    }
    if (equipos.length % qty !== 0) {
      return `No se puede distribuir equitativamente ${equipos.length} equipos en ${qty} grupos`;
    }
    return null;
  };

  const handleGeneratePreview = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validarPreview();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cantidad_grupos: Number(cantidadGrupos),
      };
      const res = await generateSorteoPreview(payload);
      setPreview(res.data);
    } catch (err) {
      console.error("Error generando preview:", err);
      const msg = err.response?.data?.message || err.message || "Error al generar preview";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSorteo = async () => {
    if (!preview) {
      setError("No hay preview para confirmar");
      return;
    }

    const ok = window.confirm("¿Confirmar el sorteo? Se guardarán las asignaciones de equipos a grupos.");
    if (!ok) return;

    setConfirmingLoading(true);
    try {
      const payload = {
        cantidad_grupos: preview.cantidad_grupos,
        grupos: preview.grupos.map((g) => ({
          id_grupo: g.id_grupo,
          equipos: g.equipos.map((e) => e.id_equipo),
        })),
      };

      await confirmSorteo(payload);
      setError("");
      setCantidadGrupos("");
      setSeed("");
      setPreview(null);
      cargarDatos();
      alert("Sorteo confirmado y guardado exitosamente");
    } catch (err) {
      console.error("Error confirmando sorteo:", err);
      const msg = err.response?.data?.message || err.message || "Error al confirmar sorteo";
      setError(msg);
    } finally {
      setConfirmingLoading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setCantidadGrupos("");
    setSeed("");
    setError("");
  };

  return (
    <div className="container py-4">
      <h1>Sorteos de Equipos</h1>

      {!preview ? (
        <form onSubmit={handleGeneratePreview} className="card p-3 mb-4 shadow-sm">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">
                Cantidad de Grupos (máximo {grupos.length})
              </label>
              <input
                className="form-control"
                type="number"
                min="2"
                value={cantidadGrupos}
                onChange={(e) => setCantidadGrupos(e.target.value)}
                placeholder="Ej: 4"
                required
              />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? "Generando..." : "Generar Preview"}
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <div className="mt-3 small text-muted">
            <p>
              <strong>Total equipos:</strong> {equipos.length}
            </p>
            <p>
              <strong>Total grupos disponibles:</strong> {grupos.length}
            </p>
          </div>
        </form>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              Preview: {preview.cantidad_grupos} grupos × {preview.equipos_por_grupo} equipos
              {preview.seed && ` (seed: ${preview.seed})`}
            </h5>
          </div>
          <div className="card-body">
            {preview.grupos.map((grupo) => (
              <div key={grupo.id_grupo} className="mb-4">
                <h6>
                  {grupo.nombre} - {grupo.descripcion}
                </h6>
                <ul className="list-group list-group-sm">
                  {grupo.equipos.map((eq) => (
                    <li key={eq.id_equipo} className="list-group-item">
                      <strong>{eq.nombre_pais}</strong> ({eq.codigo_fifa}) - Ranking: {eq.ranking_fifa}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            <div className="mt-4 d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={handleConfirmSorteo}
                disabled={confirmingLoading}
              >
                {confirmingLoading ? "Confirmando..." : "✓ Confirmar Sorteo"}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
