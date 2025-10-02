/*
  FILE: src/components/Sidebar.jsx
  Fix aplicado: rol puede venir como string o como objeto { nombreRol }
*/

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const displayName =
        (user?.nombre && user?.apellido) ? `${user.nombre} ${user.apellido}` :
            (user?.nombre) ? user.nombre :
                (user?.username) ? user.username :
                    'Usuario';

    const initialsSource = String(displayName !== 'Usuario' ? displayName : (user?.usuario ?? 'U'));
    const initials = initialsSource
        .split(' ')
        .map(s => s[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
        }
        navigate('/login');
    };

    return (
        <>
            <aside
                className="d-none d-md-flex flex-column bg-white text-dark position-fixed top-0 start-0 vh-100 border-end p-3"
                style={{ width: 240, zIndex: 1030 }}
            >
                <Link to="/" className="text-decoration-none mb-3 d-flex align-items-center gap-2">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M3 12h18" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="h5 m-0 fw-bold text-primary">ClientesPedidos</span>
                </Link>

                <div className="card p-2 mb-3" style={{ borderRadius: 10 }}>
                    <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{ width: 44, height: 44, fontWeight: 700 }}
                        >
                            {initials}
                        </div>
                        <div className="ms-2">
                            <div className="fw-bold">{displayName}</div>
                        </div>
                    </div>
                </div>

                {/* Navegación principal - mostrar todas las páginas siempre */}
                <nav className="nav flex-column mb-3">
                    <Link to="/pedidos" className="nav-link rounded px-2">Pedidos</Link>
                    <Link to="/" className="nav-link rounded px-2">Clientes</Link>
                    <Link to="/usuarios" className="nav-link rounded px-2">Usuarios</Link>
                    <Link to="/reportes" className="nav-link rounded px-2">Reportes</Link>
                </nav>

                <div className="mt-auto">
                    <div className="mb-2 small text-muted">Versión 1.0</div>
                    <button className="btn btn-outline-danger w-100" onClick={handleLogout}>Cerrar sesión</button>
                </div>
            </aside>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasSidebarLabel">ClientesPedidos</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, fontWeight: 700 }}>
                            {initials}
                        </div>
                        <div className="ms-2">
                            <div className="fw-bold">{displayName}</div>
                        </div>
                    </div>

                    <nav className="nav flex-column mb-3">
                        <Link className="nav-link" to="/pedidos" data-bs-dismiss="offcanvas">Pedidos</Link>
                        <Link className="nav-link" to="/" data-bs-dismiss="offcanvas">Clientes</Link>
                        <Link className="nav-link" to="/usuarios" data-bs-dismiss="offcanvas">Usuarios</Link>
                        <Link className="nav-link" to="/reportes" data-bs-dismiss="offcanvas">Reportes</Link>
                    </nav>

                    <div className="mt-auto">
                        <button className="btn btn-outline-danger w-100" onClick={() => { document.querySelector('#offcanvasSidebar .btn-close')?.click(); handleLogout(); }}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}