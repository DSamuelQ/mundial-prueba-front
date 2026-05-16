import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
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

                <nav className="nav flex-column mb-3">
                    {/* 
                    <Link to="/pedidos" className="nav-link rounded px-2">Pedidos</Link>
                    <Link to="/" className="nav-link rounded px-2">Clientes</Link>
                    <Link to="/reportes" className="nav-link rounded px-2">Reportes</Link>
                    <Link to="/usuarios" className="nav-link rounded px-2">Usuarios</Link>
                    */}
                    <Link to="/grupos" className="nav-link rounded px-2">Grupos</Link>
                    <Link to="/equipos" className="nav-link rounded px-2">Equipos</Link>
                    <Link to="/sorteos" className="nav-link rounded px-2">Sorteos</Link>
                </nav>

                <div className="mt-auto">
                    <div className="mb-2 small text-muted">Versión 1.0</div>
                </div>
            </aside>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Sorteo Mundial</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column">
                    <nav className="nav flex-column mb-3">
                        {/*
                        <Link className="nav-link" to="/pedidos" data-bs-dismiss="offcanvas">Pedidos</Link>
                        <Link className="nav-link" to="/" data-bs-dismiss="offcanvas">Clientes</Link>
                        <Link className="nav-link" to="/usuarios" data-bs-dismiss="offcanvas">Usuarios</Link>
                        <Link className="nav-link" to="/reportes" data-bs-dismiss="offcanvas">Reportes</Link>
                        */ }
                        <Link className="nav-link" to="/grupos" data-bs-dismiss="offcanvas">Grupos</Link>
                        <Link className="nav-link" to="/equipos" data-bs-dismiss="offcanvas">Equipos</Link>
                        <Link className="nav-link" to="/sorteos" data-bs-dismiss="offcanvas">Sorteos</Link>
                    </nav>

                    <div className="mt-auto">
                        <div className="small text-muted">Versión 1.0</div>
                    </div>
                </div>
            </div>
        </>
    );
}