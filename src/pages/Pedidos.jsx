import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtros, setFiltros] = useState({ usuario: "", desde: "", hasta: "" });

  useEffect(() => {
    const cargar = async () => {
      const res = await api.get("/pedidos");
      setPedidos(res.data);
    };
    cargar();
  }, []);

  // Filtro en frontend
  const pedidosFiltrados = pedidos.filter(p => {
    // Filtrar por usuario (usuario_pedido)
    if (
      filtros.usuario &&
      !(p.usuario_pedido && p.usuario_pedido.toLowerCase().includes(filtros.usuario.toLowerCase()))
    ) {
      return false;
    }

    const pedidoFechaStr = fechaLocalYYYYMMDD(p.fecha_pedido);

    if (filtros.desde && pedidoFechaStr < filtros.desde) {
      return false;
    }
    if (filtros.hasta && pedidoFechaStr > filtros.hasta) {
      return false;
    }
    return true;
  });

  // Normaliza fechas a yyyy-mm-dd para comparar solo la fecha
  function fechaLocalYYYYMMDD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="container py-4">
      <h1>Pedidos</h1>
      <form className="card p-3 mb-4 shadow-sm" onSubmit={e => e.preventDefault()}>
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Usuario" value={filtros.usuario}
              onChange={e => setFiltros({ ...filtros, usuario: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={filtros.desde}
              onChange={e => setFiltros({ ...filtros, desde: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={filtros.hasta}
              onChange={e => setFiltros({ ...filtros, hasta: e.target.value })} />
          </div>
        </div>
      </form>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map(p => (
                  <tr key={p.id_pedido}>
                    <td>{p.id_pedido}</td>
                    <td>{p.nombre} {p.apellido}</td>
                    <td>{p.usuario_pedido}</td>
                    <td>{new Date(p.fecha_pedido).toLocaleString()}</td>
                    <td>Q{p.total}</td>
                    <td>
                      <a className="btn btn-info btn-sm text-white" href={`/pedidos/${p.id_pedido}`}>Ver detalle</a>
                    </td>
                  </tr>
                ))}
                {pedidosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">No hay pedidos con esos filtros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
