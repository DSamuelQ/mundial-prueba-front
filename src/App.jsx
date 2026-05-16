import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import Grupos from './pages/Grupos';
import EquiposCrud from './pages/EquiposCrud';
import Sorteos from './pages/Sorteos';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Sidebar />
        <main className="app-main with-sidebar">
          <div className="container-fluid p-3">
            <div className="d-md-none mb-3">
              <button
                className="btn btn-outline-primary"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasSidebar"
                aria-controls="offcanvasSidebar"
              >
                ☰
              </button>
            </div>

            <Routes>
              {/* 
              <Route path="/" element={<Clientes />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/pedidos/:id" element={<PedidoDetalle />} />
              <Route path="/reportes" element={<Reports />} />
              */}
              <Route path="/grupos" element={<Grupos />} />
              <Route path="/equipos" element={<EquiposCrud />} />
              <Route path="/sorteos" element={<Sorteos />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}