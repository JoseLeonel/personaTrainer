import React from 'react';


/**
 * Lateral menu for the client view.
 * Includes links to:
 *   - Historial de pagos
 *   - Progreso (fotos)
 *   - Rutina asignada
 *   - Historial de pesos
 *
 * The menu uses the existing utility classes (btn, glass-panel, etc.)
 * and respects the app's dark / glassmorphism theme. Buttons are fully
 * rounded (`var(--radius-full)`).
 */
export default function ClientSidebar({ isOpen, onSelectSection }: { isOpen: boolean; onSelectSection: (section: string) => void }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img src="/logo.png" alt="E-Forge Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
        <h2 className="text-xl font-bold">E-Forge</h2>
      </div>
      <nav className="sidebar-menu">
        <button className="sidebar-item" onClick={() => onSelectSection('PAYMENTS')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>Historial de pagos</span>
        </button>
        <button className="sidebar-item" onClick={() => onSelectSection('PROGRESS')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Progreso</span>
        </button>
        <button className="sidebar-item" onClick={() => onSelectSection('ROUTINE')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Rutina asignada</span>
        </button>
        <button className="sidebar-item" onClick={() => onSelectSection('WEIGHT')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span>Historial de pesos</span>
        </button>
      </nav>
    </aside>
  );
}

