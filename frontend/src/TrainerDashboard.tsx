import { API_URL } from './config';
import { useState, useEffect } from 'react';
import './index.css';
import TrainerSidebar from './TrainerSidebar';
import ExercisesCatalog from './ExercisesCatalog';
import ClientsCatalog from './ClientsCatalog';

interface ClientProfile {
  id: number;
  currentWeight: number;
  height: number;
  mainGoal: string;
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE';
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  profile: ClientProfile;
}

export default function TrainerDashboard({ trainerId, onLogout }: { trainerId?: number, onLogout?: () => void }) {
  const [pendingClients, setPendingClients] = useState<Client[]>([]);
  const [inviteCode, setInviteCode] = useState<{ code: string; expiresAt: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('DASHBOARD');
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);

  // Progress Photos state
  const [selectedClientPhotos, setSelectedClientPhotos] = useState<any[] | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Use the passed trainerId or fallback to 1 (useful for testing if circumventing login)
  const currentTrainerId = trainerId || 1;

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const [activeRes, pendingRes, codeRes] = await Promise.all([
        fetch(`${API_URL}/clients`),
        fetch(`${API_URL}/clients/pending`),
        fetch(`${API_URL}/auth/invite-code/${currentTrainerId}`)
      ]);
      const pendingData = await pendingRes.json();
      
      // Manejar el caso de que no haya código activo (puede devolver 404 o null)
      if (codeRes.ok) {
        const codeData = await codeRes.json();
        if (codeData && codeData.code) {
          setInviteCode(codeData);
        }
      }
      
      setPendingClients(pendingData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      const res = await fetch(`${API_URL}/trainer-dashboard/${currentTrainerId}/metrics`);
      if (res.ok) {
        const data = await res.json();
        setDashboardMetrics(data);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  useEffect(() => {
    fetchClients();
    if (selectedSection === 'DASHBOARD') {
      fetchDashboardMetrics();
    }
  }, [selectedSection]);

  const generateInviteCode = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/invite-code/${currentTrainerId}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setInviteCode(data);
      }
    } catch (err) {
      console.error('Error generating invite code:', err);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/clients/${id}/approve`, {
        method: 'PUT'
      });
      if (res.ok) {
        // Refrescar las listas
        fetchClients();
      } else {
        alert('Error al aprobar cliente');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatGoal = (goal: string) => {
    const map: any = {
      LOSE_FAT: 'Perder Grasa',
      GAIN_MUSCLE: 'Ganar Músculo',
      RECOMPOSITION: 'Recomposición',
      HEALTH: 'Salud',
      PERFORMANCE: 'Rendimiento'
    };
    return map[goal] || goal;
  };

  return (
    <>
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`} 
        onClick={toggleSidebar}
      ></div>

      <TrainerSidebar isOpen={isSidebarOpen} onSelectSection={(section) => {
        setSelectedSection(section);
        setIsSidebarOpen(false);
      }} />

      <div className="app-container p-6 text-white min-h-screen" style={{ background: 'var(--bg-primary)', maxWidth: 'none', marginLeft: 'auto', marginRight: 'auto' }}>
        <header className="mb-6 relative flex flex-row justify-between items-center h-12">
          {/* Menu Button (Left Edge) */}
          <div className="absolute left-0 z-10">
            <button className="btn-icon sm:hidden flex-shrink-0" onClick={toggleSidebar} style={{ background: 'transparent', padding: '0', margin: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
          
          {/* Centered Title */}
          <div className="w-full flex flex-col items-center justify-center text-center">
            <h1 className="text-lg font-bold leading-tight m-0 p-0 text-white">Panel del Entrenador</h1>
            <p className="text-xs text-muted hidden sm:block m-0 p-0">Control de Clientes y Progreso</p>
          </div>

          {/* Logout Button (Right Edge) */}
          <div className="absolute right-0 z-10">
            {onLogout && (
              <button 
                onClick={onLogout}
                className="text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0"
                style={{
                  padding: '8px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <span>Salir</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            )}
          </div>
        </header>

        {selectedSection === 'GENERATE_CODE' && (
          <div className="glass-panel p-6 mb-8 flex flex-col md:flex-row items-center justify-between" style={{ border: '1px solid var(--accent-primary)' }}>
            <div>
              <h2 className="text-xl font-bold mb-2">Tu Código de Invitación</h2>
              {inviteCode ? (
                <div>
                  <p className="text-3xl font-mono text-yellow-400 font-bold mb-1 tracking-widest">{inviteCode.code}</p>
                  <p className="text-xs text-muted">Válido hasta: {new Date(inviteCode.expiresAt).toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-sm text-muted">No tienes ningún código activo.</p>
              )}
            </div>
            <button 
              className="btn btn-accent mt-4 md:mt-0" 
              onClick={generateInviteCode}
            >
              Generar Nuevo Código
            </button>
          </div>
        )}

        {selectedSection === 'DASHBOARD' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-panel p-6 text-center" style={{ borderTop: '4px solid #10b981' }}>
              <h3 className="text-3xl font-bold text-white mb-1">{dashboardMetrics?.activeClients ?? 0}</h3>
              <p className="text-sm text-green-400 font-semibold uppercase tracking-wider">Clientes Activos</p>
            </div>
            <div className="glass-panel p-6 text-center" style={{ borderTop: '4px solid #f59e0b' }}>
              <h3 className="text-3xl font-bold text-white mb-1">{dashboardMetrics?.pendingPayments ?? 0}</h3>
              <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wider">Pendientes de Pago</p>
            </div>
            <div className="glass-panel p-6 text-center" style={{ borderTop: '4px solid #ef4444' }}>
              <h3 className="text-3xl font-bold text-white mb-1">{dashboardMetrics?.missingTrainingToday ?? 0}</h3>
              <p className="text-sm text-red-400 font-semibold uppercase tracking-wider">Sin entrenar hoy</p>
            </div>
            <div className="glass-panel p-6 text-center" style={{ borderTop: '4px solid #8b5cf6' }}>
              <h3 className="text-3xl font-bold text-white mb-1">₡{(dashboardMetrics?.monthlyIncome ?? 0).toLocaleString()}</h3>
              <p className="text-sm text-purple-400 font-semibold uppercase tracking-wider">Ingresos del Mes</p>
            </div>
          </div>
        )}

        {selectedSection === 'APPROVE_CLIENTS' && (
          <div className="glass-panel p-6 mb-8" style={{ border: '1px solid var(--accent-secondary)' }}>
            <h2 className="text-xl font-bold mb-6 text-pink-500">Solicitudes Nuevas ({pendingClients.length})</h2>
            {pendingClients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700 text-muted">
                      <th className="pb-3 px-2">Nombre</th>
                      <th className="pb-3 px-2">Objetivo</th>
                      <th className="pb-3 px-2">Peso/Altura</th>
                      <th className="pb-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingClients.map(client => (
                      <tr key={client.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                        <td className="py-4 px-2 font-medium">{client.firstName} {client.lastName}</td>
                        <td className="py-4 px-2 text-sm text-gray-300">{formatGoal(client.profile?.mainGoal)}</td>
                        <td className="py-4 px-2 text-sm text-gray-300">
                          {client.profile?.currentWeight}kg / {client.profile?.height}cm
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button 
                            className="btn btn-accent text-xs whitespace-nowrap" 
                            style={{ borderRadius: '9999px', padding: '6px 12px', background: 'var(--accent-secondary)' }}
                            onClick={() => handleApprove(client.id)}
                          >
                            Aprobar Cliente
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center py-4">No hay solicitudes pendientes.</p>
            )}
          </div>
        )}

      {/* Progress Photos Modal */}
      {selectedClientPhotos !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Progreso</h2>
              <button className="btn-icon" onClick={() => setSelectedClientPhotos(null)}>✕</button>
            </div>
            
            {selectedClientPhotos.length === 0 ? (
              <p className="text-center text-muted py-8">Este cliente no ha subido fotos de progreso todavía.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedClientPhotos.map((photo, i) => (
                  <div key={i} className="flex flex-col bg-tertiary rounded-lg overflow-hidden border border-gray-800">
                    <img 
                      src={`${API_URL}${photo.filePath}`} 
                      alt="Progress" 
                      className="w-full h-auto object-cover aspect-square"
                    />
                    <div className="p-3 bg-black bg-opacity-50">
                      <p className="font-bold">{photo.photoType === 'UPPER_BODY' ? 'Parte Superior' : 'Parte Inferior'}</p>
                      <p className="text-xs text-muted">{new Date(photo.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

        {selectedSection === 'CLIENTS' && (
          <ClientsCatalog />
        )}

        {selectedSection === 'BILLING' && (
          <div className="glass-panel p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Cobro de Clientes</h2>
            <p className="text-muted">Pantalla de facturación y pagos en construcción.</p>
          </div>
        )}

        {selectedSection === 'ROUTINES' && (
          <div className="glass-panel p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Asignar Rutina Semanal</h2>
            <p className="text-muted">Pantalla para crear y asignar rutinas en construcción.</p>
          </div>
        )}

        {selectedSection === 'MAINTENANCE_EXERCISES' && (
          <ExercisesCatalog />
        )}
      </div>
    </>
  );
}
