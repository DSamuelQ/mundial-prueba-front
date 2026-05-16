import { useEffect, useState } from "react";
import { generateSorteoPreview, confirmSorteo, getSorteos } from "../api/sorteos";
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
  const [sorteos, setSorteos] = useState([]);
  const [activeTab, setActiveTab] = useState("nuevo"); // "nuevo" o "historico"
  const [sorteoLoading, setSorteoLoading] = useState(false);
  const [showModalSorteo, setShowModalSorteo] = useState(false);

  useEffect(() => {
    cargarDatos();
    cargarSorteos();
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

  const cargarSorteos = async () => {
    setSorteoLoading(true);
    try {
      const res = await getSorteos();
      setSorteos(res.data);
    } catch (err) {
      console.error("Error cargando sorteos:", err);
    } finally {
      setSorteoLoading(false);
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
      setPreview(null);
      cargarDatos();
      cargarSorteos();
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
    setError("");
    setShowModalSorteo(false);
  };

  return (
    <div className="container py-4">
      <h1>Sorteos de Equipos</h1>

      {/* Pestañas */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "nuevo" ? "active" : ""}`}
            onClick={() => setActiveTab("nuevo")}
            type="button"
            role="tab"
            aria-selected={activeTab === "nuevo"}
          >
            Crear Nuevo Sorteo
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "historico" ? "active" : ""}`}
            onClick={() => setActiveTab("historico")}
            type="button"
            role="tab"
            aria-selected={activeTab === "historico"}
          >
            Sorteos Anteriores
          </button>
        </li>
      </ul>

      {/* Contenido de pestaña: Nuevo Sorteo */}
      {activeTab === "nuevo" && (
        <>
          <div className="mb-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                setCantidadGrupos("");
                setError("");
                setShowModalSorteo(true);
              }}
            >
              + Crear Nuevo Sorteo
            </button>
          </div>

          {/* Modal */}
          <div
            className={`modal fade ${showModalSorteo ? "show" : ""}`}
            id="modalSorteo"
            tabIndex="-1"
            aria-labelledby="modalSorteoLabel"
            aria-hidden={!showModalSorteo}
            style={{ display: showModalSorteo ? "block" : "none" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="modalSorteoLabel">
                    Crear Nuevo Sorteo
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => handleCancel()}
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={handleGeneratePreview}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="cantidadGrupos" className="form-label">
                        Cantidad de Grupos (máximo {grupos.length}) *
                      </label>
                      <input
                        className="form-control"
                        id="cantidadGrupos"
                        type="number"
                        min="2"
                        value={cantidadGrupos}
                        onChange={(e) => setCantidadGrupos(e.target.value)}
                        placeholder="Ej: 4"
                        required
                      />
                    </div>

                    <div className="small text-muted mb-3">
                      <p className="mb-2">
                        <strong>Total equipos:</strong> {equipos.length}
                      </p>
                      <p className="mb-0">
                        <strong>Total grupos disponibles:</strong> {grupos.length}
                      </p>
                    </div>

                    {error && <div className="alert alert-danger mb-0">{error}</div>}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleCancel()}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Generando..." : "Generar Preview"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          {showModalSorteo && (
            <div
              className="modal-backdrop fade show"
              onClick={() => handleCancel()}
            ></div>
          )}

          {/* Preview */}
          {preview && (
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  Preview: {preview.cantidad_grupos} grupos × {preview.equipos_por_grupo} equipos
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
        </>
      )}

      {/* Contenido de pestaña: Sorteos Anteriores */}
      {activeTab === "historico" && (
        <div className="card shadow-sm">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Historial de Sorteos</h5>
          </div>
          <div className="card-body">
            {sorteoLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : sorteos.length === 0 ? (
              <div className="alert alert-warning mb-0">No hay sorteos históricos</div>
            ) : (
              <div className="accordion" id="accordionSorteos">
                {sorteos.map((sorteo, index) => (
                  <div key={sorteo.id_sorteo} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${sorteo.id_sorteo}`}
                        aria-expanded="false"
                        aria-controls={`collapse${sorteo.id_sorteo}`}
                      >
                        <span>
                          <strong>Sorteo #{sorteo.id_sorteo}</strong>
                          {sorteo.fecha_sorteo && (
                            <span className="ms-2 text-muted">
                              ({new Date(sorteo.fecha_sorteo).toLocaleDateString("es-ES")})
                            </span>
                          )}
                        </span>
                      </button>
                    </h2>
                    <div
                      id={`collapse${sorteo.id_sorteo}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionSorteos"
                    >
                      <div className="accordion-body">
                        {sorteo.grupos && sorteo.grupos.length > 0 ? (
                          <div className="row">
                            {sorteo.grupos.map((grupo) => (
                              <div key={grupo.id_grupo} className="col-md-6 mb-4">
                                <div className="card border-primary">
                                  <div className="card-header bg-primary text-white">
                                    <h6 className="mb-0">{grupo.nombre}</h6>
                                    {grupo.descripcion && (
                                      <small className="text-light">{grupo.descripcion}</small>
                                    )}
                                  </div>
                                  <div className="card-body p-0">
                                    <table className="table table-sm mb-0">
                                      <thead className="table-light">
                                        <tr>
                                          <th>País</th>
                                          <th>Código</th>
                                          <th>Ranking</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {grupo.equipos && grupo.equipos.length > 0 ? (
                                          grupo.equipos.map((eq) => (
                                            <tr key={eq.id_equipo}>
                                              <td>{eq.nombre_pais}</td>
                                              <td>{eq.codigo_fifa}</td>
                                              <td>{eq.ranking_fifa}</td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan="3" className="text-center text-muted">
                                              Sin equipos
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="alert alert-warning mb-0">Sin información de grupos</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
