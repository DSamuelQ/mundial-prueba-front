import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Clientes from './pages/Clientes';
import Pedidos from './pages/Pedidos';
import PedidoDetalle from './pages/PedidoDetalle';
import Users from './pages/Users';
import Reports from './pages/Reports';

function AppContent() {
  const { user } = useAuth();
  return (
    <div className="app-root">
      {user && <Sidebar />}

      <main className={user ? 'app-main with-sidebar' : 'app-main'}>
        <div className="container-fluid p-3">
          {user && (
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
          )}

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
            {/* Mostrar Users y Reports sin condicionar por rol */}
            <Route path="/usuarios" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
            <Route path="/pedidos/:id" element={<ProtectedRoute><PedidoDetalle /></ProtectedRoute>} />
            <Route path="/reportes" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}