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
    if (filtros.usuario && !p.usuario_pedido.toLowerCase().includes(filtros.usuario.toLowerCase())) {
      return false;
    }
    // Filtrar por fecha desde
    if (filtros.desde && new Date(p.fecha_pedido) < new Date(filtros.desde)) {
      return false;
    }
    // Filtrar por fecha hasta
    if (filtros.hasta && new Date(p.fecha_pedido) > new Date(filtros.hasta + "T23:59:59")) {
      return false;
    }
    return true;
  });

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
