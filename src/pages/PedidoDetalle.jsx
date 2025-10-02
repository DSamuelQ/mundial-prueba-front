import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import PedidoMapa from "../components/PedidoMapa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PedidoDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    api.get(`/pedidos/${id}`).then(res => setPedido(res.data));
  }, [id]);

  const exportarPDF = () => {
    if (!pedido) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Detalle de Pedido #${pedido.id_pedido}`, 14, 18);

    doc.setFontSize(12);
    doc.text(`Cliente: ${pedido.nombre} ${pedido.apellido}`, 14, 30);
    doc.text(`Teléfono: ${pedido.telefono || ""}`, 14, 38);
    doc.text(`Fecha: ${pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleString() : ""}`, 14, 46);
    doc.text(`Total: Q${Number(pedido.total).toFixed(2)}`, 14, 54);

    if (pedido.detalles && pedido.detalles.length > 0) {
      autoTable(doc, {
        startY: 64,
        head: [["Producto", "Cantidad", "Precio unitario"]],
        body: pedido.detalles.map(d => [
          d.nombre_producto,
          d.cantidad,
          `Q${Number(d.precio_unitario).toFixed(2)}`
        ]),
      });
    }

    doc.save(`pedido_${pedido.id_pedido}.pdf`);
  };

  if (!pedido) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Pedido #{pedido.id_pedido}</h1>
        <button className="btn btn-danger" onClick={exportarPDF}>
          Exportar PDF
        </button>
      </div>
      <p><b>Cliente:</b> {pedido.nombre} {pedido.apellido}</p>
      <p><b>Teléfono:</b> {pedido.telefono}</p>
      <p><b>Total:</b> Q{pedido.total}</p>

      <h2 className="text-lg mt-4">Detalles</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Producto</th><th>Cantidad</th><th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {pedido.detalles.map((d, i) => (
            <tr key={i}>
              <td>{d.nombre_producto}</td>
              <td>{d.cantidad}</td>
              <td>Q{d.precio_unitario}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pedido.latitud && pedido.longitud && (
        <PedidoMapa lat={Number(pedido.latitud)} lng={Number(pedido.longitud)} />
      )}
    </div>
  );
}
