import { useEffect, useState } from "react";
import { getEstadisticas } from "../api/pedidos";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const res = await getEstadisticas();
        setStats(res.data);
      } catch (err) {
        setError("Error al cargar estadísticas.");
      }
    };
    load();
  }, []);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte General de Pedidos", 14, 18);

    doc.setFontSize(12);
    doc.text(`Total pedidos: ${stats.totalPedidos}`, 14, 30);
    doc.text(`Total vendido: Q${Number(stats.totalVendido).toFixed(2)}`, 14, 38);

    if (stats.porUsuario && stats.porUsuario.length > 0) {
      autoTable(doc, {
        startY: 48,
        head: [["Usuario", "Pedidos", "Total vendido"]],
        body: stats.porUsuario.map(u => [
          u.usuario,
          u.pedidos,
          `Q${Number(u.totalVendido).toFixed(2)}`
        ]),
      });
    }

    doc.save("reporte_pedidos.pdf");
  };

  if (error) return <div className="container py-4 text-danger">{error}</div>;
  if (!stats) return <div className="container py-4">Cargando reportes...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Reporte general</h2>
        <button className="btn btn-danger" onClick={exportarPDF}>
          Exportar PDF
        </button>
      </div>
      <p><strong>Total pedidos:</strong> {stats.totalPedidos}</p>
      <p><strong>Total vendido:</strong> Q{Number(stats.totalVendido).toFixed(2)}</p>

      <h4 className="mt-4">Ventas por usuario</h4>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr><th>Usuario</th><th>Pedidos</th><th>Total vendido</th></tr>
          </thead>
          <tbody>
            {(stats.porUsuario ?? []).map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.usuario}</td>
                <td>{u.pedidos}</td>
                <td>Q{Number(u.totalVendido).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
