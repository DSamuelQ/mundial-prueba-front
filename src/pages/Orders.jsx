import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:3000/orders", {
      params: { userId, fromDate, toDate }
    });
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Pedidos</h1>
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="ID Usuario" value={userId} onChange={(e)=>setUserId(e.target.value)} />
        <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} />
        <button onClick={fetchOrders} className="bg-blue-500 text-white px-4">Filtrar</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th><th>Usuario</th><th>Fecha</th><th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user.name}</td>
              <td>{o.date}</td>
              <td>{o.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
