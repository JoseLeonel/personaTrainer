import React, { useState } from 'react';

/**
 * Menu lateral para la vista del Entrenador.
 * Opciones: Home, Clientes Activos, Aprobar Clientes, Generar Código, Cobros, Asignar Rutina, Mantenimiento.
 */
export default function TrainerSidebar({ isOpen, onSelectSection }: { isOpen: boolean; onSelectSection: (section: string) => void }) {
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img src="/logo.png" alt="E-Forge Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
        <h2 className="text-xl font-bold">Entrenador</h2>
      </div>
      <nav className="sidebar-menu flex-1 overflow-y-auto pb-20">
        <button className="sidebar-item" onClick={() => onSelectSection('DASHBOARD')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Dashboard</span>
        </button>

        <button className="sidebar-item" onClick={() => onSelectSection('CLIENTS')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Mis Clientes</span>
        </button>

        <button className="sidebar-item" onClick={() => onSelectSection('APPROVE_CLIENTS')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>Aprobar Clientes</span>
        </button>

        <button className="sidebar-item" onClick={() => onSelectSection('GENERATE_CODE')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Generar Código</span>
        </button>

        <button className="sidebar-item" onClick={() => onSelectSection('BILLING')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <span>Cobro de Clientes</span>
        </button>

        <button className="sidebar-item" onClick={() => onSelectSection('ROUTINES')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Asignar Rutina</span>
        </button>

        <div className="mt-2 border-t border-gray-800 pt-2">
          <button 
            className="sidebar-item w-full flex justify-between" 
            onClick={() => setMaintenanceOpen(!maintenanceOpen)}
          >
            <div className="flex items-center gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Mantenimiento</span>
            </div>
            <span>{maintenanceOpen ? '▲' : '▼'}</span>
          </button>
          
          {maintenanceOpen && (
            <div className="flex flex-col gap-1 mt-2 pl-4 ml-6 border-l border-gray-700">
              <button className="sidebar-item" style={{ fontSize: '0.9rem', padding: '10px' }} onClick={() => onSelectSection('MAINTENANCE_EXERCISES')}>
                Catálogo de Ejercicios
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
