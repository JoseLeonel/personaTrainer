import React from 'react';
import { useState } from 'react';
import WeeklySchedule from './WeeklySchedule';
import './index.css';
import './sidebar.css';
import ClientSidebar from './ClientSidebar';
import Login from './Login';
import RegisterWizard from './RegisterWizard';
import TrainerDashboard from './TrainerDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD'>('LOGIN');
  const [role, setRole] = useState<'CLIENT' | 'TRAINER'>('TRAINER'); // DEFAULT TO TRAINER FOR NOW
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('WEIGHT');
  const [weight, setWeight] = useState(80);
  const [reps, setReps] = useState(8);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sets, setSets] = useState([
    { id: 1, weight: 80, reps: 10, completed: true },
    { id: 2, weight: 80, reps: 9, completed: true },
  ]);

  const handleLogSet = () => {
    setSets([...sets, { id: Date.now(), weight, reps, completed: true }]);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setRole(user.role);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LOGIN');
  };

  if (currentView === 'LOGIN') {
    return <Login onLogin={handleLoginSuccess} onRegisterClick={() => setCurrentView('REGISTER')} />;
  }

  if (currentView === 'REGISTER') {
    return <RegisterWizard onComplete={() => setCurrentView('LOGIN')} onCancel={() => setCurrentView('LOGIN')} />;
  }

  return (
    <>
      {/* TEMP: ROLE SWITCHER FOR DEMO PURPOSES */}
      <div className="fixed top-0 left-0 right-0 bg-blue-900 text-white text-xs p-1 flex justify-center gap-4 z-50">
        <span>Modo Vista:</span>
        <button className={`font-bold ${role === 'TRAINER' ? 'text-yellow-400' : ''}`} onClick={() => setRole('TRAINER')}>Entrenador</button>
        <button className={`font-bold ${role === 'CLIENT' ? 'text-yellow-400' : ''}`} onClick={() => setRole('CLIENT')}>Cliente</button>
      </div>
      <div style={{ marginTop: '24px' }}>
        {role === 'TRAINER' ? (
          <TrainerDashboard trainerId={currentUser?.id || 1} onLogout={handleLogout} />
        ) : (
          <>
            {/* Sidebar Backdrop */}
            <div 
              className={`sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`} 
              onClick={toggleSidebar}
            ></div>

            {/* Client Sidebar */}
            <ClientSidebar isOpen={isSidebarOpen} onSelectSection={setSelectedSection} />

            <div className="app-container animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <button className="btn-icon" onClick={() => toggleSidebar()} style={{ background: 'transparent' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <button 
              onClick={handleLogout} 
              className="text-sm font-bold flex items-center gap-2 transition-all"
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              <span>Salir</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
              {selectedSection === 'HOME' && (
                <div className="flex flex-col gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Peso (kg)</span>
                    <div className="flex items-center gap-2">
                      <button className="btn-icon" onClick={() => setWeight(w => w - 2.5)}>-</button>
                      <input 
                        type="number" 
                        className="input-minimal" 
                        value={weight} 
                        onChange={(e) => setWeight(Number(e.target.value))}
                      />
                      <button className="btn-icon" onClick={() => setWeight(w => w + 2.5)}>+</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Reps</span>
                    <div className="flex items-center gap-2">
                      <button className="btn-icon" onClick={() => setReps(r => Math.max(0, r - 1))}>-</button>
                      <input 
                        type="number" 
                        className="input-minimal" 
                        value={reps} 
                        onChange={(e) => setReps(Number(e.target.value))}
                      />
                      <button className="btn-icon" onClick={() => setReps(r => r + 1)}>+</button>
                    </div>
                  </div>
                  
                  <div className="p-3 mt-2 rounded-md" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <p className="text-sm" style={{ color: '#60a5fa' }}>
                      💡 <strong>AI Coach:</strong> Lograste 9 reps en tu último set. ¡Intenta subir 2.5kg!
                    </p>
                  </div>

                  <button className="btn btn-accent w-full mt-2" style={{ height: '56px', fontSize: '1.1rem' }} onClick={handleLogSet}>
                    Registrar Set
                  </button>

                  {/* Weekly Schedule */}
                  {selectedDay && <WeeklySchedule selectedDay={selectedDay} setDay={setSelectedDay} />}

                  {/* Up Next Preview */}
                  <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-sm text-muted mb-1">Siguiente ejercicio</p>
                    <h3 className="font-semibold">Press Inclinado con Mancuernas</h3>
                    <p className="text-xs text-muted mt-1">Sugerido: 30 kg x 8 reps</p>
                  </div>
                </div>
              )}

              {selectedSection === 'ROUTINE' && (
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">Mi Rutina Semanal</h2>
                  <WeeklySchedule selectedDay={selectedDay} setDay={setSelectedDay} />
                  
                  <div className="mt-6">
                    {selectedDay ? (
                      <div className="glass-panel p-4">
                        <h3 className="text-lg font-semibold text-accent-primary mb-2">Entrenamiento del {selectedDay}</h3>
                        <p className="text-sm text-muted mb-4">Tus ejercicios programados aparecerán aquí.</p>
                        {/* Placeholder for actual routine data */}
                        <div className="flex flex-col gap-3">
                          <div className="p-3 rounded-md bg-bg-tertiary border border-border-subtle">
                            <span className="font-bold">Sentadillas</span>
                            <span className="text-sm text-muted block">4 sets x 10 reps</span>
                          </div>
                          <div className="p-3 rounded-md bg-bg-tertiary border border-border-subtle">
                            <span className="font-bold">Press de Banca</span>
                            <span className="text-sm text-muted block">3 sets x 12 reps</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center border border-dashed border-border-subtle rounded-lg">
                        <p className="text-sm text-muted">Selecciona un día arriba para ver tu rutina correspondiente.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedSection === 'WEIGHT' && (
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">Progreso de Peso</h2>
                  <div className="glass-panel p-4 mt-4">
                    <p className="text-sm text-muted mb-6">Últimos meses (Datos Dummy)</p>
                    <div className="flex items-end justify-between h-48 gap-2 pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {[
                        { label: 'Ene', value: 75, max: 100 },
                        { label: 'Feb', value: 76, max: 100 },
                        { label: 'Mar', value: 78, max: 100 },
                        { label: 'Abr', value: 77, max: 100 },
                        { label: 'May', value: 80, max: 100 },
                      ].map((data, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                          <div className="w-full flex items-end justify-center h-full pb-1">
                            <div 
                              className="w-full max-w-[30px]" 
                              style={{ 
                                height: `${(data.value / data.max) * 100}%`, 
                                background: i === 4 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                                borderTopLeftRadius: '4px',
                                borderTopRightRadius: '4px'
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted mt-1">{data.label}</span>
                          <span className="text-xs font-bold">{data.value}kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Navigation (Mobile) */}
              <nav className="bottom-nav">
                <a href="#" className="nav-item active" onClick={() => setSelectedSection('ROUTINE')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Rutina
                </a>
                <a href="#" className="nav-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
                  Historial
                </a>
                <a href="#" className="nav-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Perfil
                </a>
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
