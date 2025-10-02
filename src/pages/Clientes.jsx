import { useEffect, useState } from "react";
import { getClientes, createCliente } from "../api/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "", direccion: "", empresa_local: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getClientes();
        setClientes(res.data);
      } catch (err) {
        console.error("Error cargando clientes:", err);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.apellido) {
      setError("Nombre y apellido son obligatorios");
      return;
    }
    setLoading(true);
    try {
      await createCliente(form); // ahora envía empresa_local también
      const res = await getClientes();
      setClientes(res.data);
      setForm({ nombre: "", apellido: "", telefono: "", direccion: "", empresa_local: "" });
    } catch (err) {
      console.error("Error al crear cliente:", err);
      setError(err.response?.data?.message || "Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1>Clientes</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <input className="form-control" placeholder="Nombre" value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })} />
        </div>
        <div className="mb-2">
          <input className="form-control" placeholder="Apellido" value={form.apellido}
            onChange={e => setForm({ ...form, apellido: e.target.value })} />
        </div>
        <div className="mb-2">
          <input className="form-control" placeholder="Teléfono" value={form.telefono}
            onChange={e => setForm({ ...form, telefono: e.target.value })} />
        </div>
        <div className="mb-2">
          <input className="form-control" placeholder="Dirección" value={form.direccion}
            onChange={e => setForm({ ...form, direccion: e.target.value })} />
        </div>
        <div className="mb-2">
          <input className="form-control" placeholder="Empresa local" value={form.empresa_local}
            onChange={e => setForm({ ...form, empresa_local: e.target.value })} />
        </div>

        {error && <div className="text-danger mb-2">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Agregar"}
        </button>
      </form>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Dirección</th></tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id_cliente}>
                <td>{c.id_cliente}</td>
                <td>{c.nombre}</td>
                <td>{c.apellido}</td>
                <td>{c.telefono}</td>
                <td>{c.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
