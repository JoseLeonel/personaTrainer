import React, { useState, useEffect, useRef } from 'react';
import SwipeableClientItem from './SwipeableClientItem';
import type { ClientData } from './SwipeableClientItem';
import { API_URL } from './config';

// TODO: Create ClientForm component for Edit/Create
// import ClientForm from './ClientForm';

export default function ClientsCatalog() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterGoal, setFilterGoal] = useState('');
  const [filterCharge, setFilterCharge] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const limit = 6;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Default trainerId for MVP
  const trainerId = 1;

  const fetchClients = async (pageNum: number, reset = false) => {
    if (reset) setIsLoading(true);
    try {
      let url = `${API_URL}/clients/trainer/${trainerId}?limit=${limit}&offset=${(pageNum - 1) * limit}`;
      if (filterName) url += `&search=${encodeURIComponent(filterName)}`;
      if (filterGoal) url += `&objective=${encodeURIComponent(filterGoal)}`;
      if (filterCharge) url += `&chargeType=${encodeURIComponent(filterCharge)}`;
      
      const res = await fetch(url);
      const dataResponse = await res.json();
      const data = dataResponse.data || [];
      
      setHasMore(data.length === limit);

      if (reset) {
        setClients(data);
      } else {
        setClients(prev => {
          const newItems = data.filter((d: ClientData) => !prev.find(p => p.id === d.id));
          return [...prev, ...newItems];
        });
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchClients(1, true);
  }, [filterName, filterGoal, filterCharge]);

  useEffect(() => {
    if (page > 1) {
      fetchClients(page, false);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const handleOpenForm = (id?: number) => {
    setEditingId(id || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = (shouldRefresh?: boolean) => {
    setIsFormOpen(false);
    setEditingId(null);
    if (shouldRefresh) {
      fetchClients(1, true);
    }
  };

  const handleToggleStatus = async (id: number) => {
    const client = clients.find(c => c.id === id);
    const newStatus = client?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    if (window.confirm(`¿Seguro que deseas marcar al cliente como ${newStatus}?`)) {
      try {
        const res = await fetch(`${API_URL}/clients/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
          fetchClients(1, true);
        } else {
          alert('Error al actualizar el estado');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePayment = async (id: number) => {
    const amount = prompt('Ingrese el monto del pago para este cliente:');
    if (amount && !isNaN(Number(amount))) {
      try {
        const res = await fetch(`${API_URL}/payments/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: id,
            amount: Number(amount),
            paymentDate: new Date().toISOString().split('T')[0],
          })
        });
        if (res.ok) {
          alert('Pago registrado correctamente');
          fetchClients(1, true);
        } else {
          alert('Error registrando pago');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {isFormOpen ? (
        <div className="glass-panel p-8 text-center text-white" style={{ borderRadius: '24px' }}>
          <h2>Formulario de Cliente</h2>
          <p className="text-muted">En construcción...</p>
          <button className="btn btn-outline mt-4" onClick={() => handleCloseForm()}>Cerrar</button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Mis Clientes</h2>
              <p className="text-sm text-muted">Gestión y control de suscripciones</p>
            </div>

          </div>

          <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row gap-4" style={{ borderRadius: '24px' }}>
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="bg-tertiary border border-gray-700 text-white focus:outline-none focus:border-orange-500 flex-1"
              style={{ padding: '12px 20px', borderRadius: '9999px' }}
            />
            <select 
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value)}
              className="bg-tertiary border border-gray-700 text-white focus:outline-none focus:border-orange-500 w-full md:w-48 appearance-none"
              style={{ padding: '12px 20px', borderRadius: '9999px' }}
            >
              <option value="">Todos los Objetivos</option>
              <option value="LOSE_FAT">Bajar Grasa</option>
              <option value="GAIN_MUSCLE">Ganar Masa</option>
              <option value="RECOMPOSITION">Recomposición</option>
              <option value="PERFORMANCE">Rendimiento</option>
              <option value="HEALTH">Salud</option>
            </select>
            <select 
              value={filterCharge}
              onChange={(e) => setFilterCharge(e.target.value)}
              className="bg-tertiary border border-gray-700 text-white focus:outline-none focus:border-orange-500 w-full md:w-48 appearance-none"
              style={{ padding: '12px 20px', borderRadius: '9999px' }}
            >
              <option value="">Todos los Cobros</option>
              <option value="DAILY">Diario</option>
              <option value="WEEKLY">Semanal</option>
              <option value="BIWEEKLY">Quincenal</option>
              <option value="MONTHLY">Mensual</option>
            </select>
          </div>

          {isLoading && clients.length === 0 ? (
            <div className="text-center py-12 text-muted">Cargando clientes...</div>
          ) : clients.length === 0 ? (
            <div className="glass-panel text-center py-12 text-muted" style={{ borderRadius: '24px' }}>
              No se encontraron clientes activos.
            </div>
          ) : (
            <>
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ display: 'grid', gap: '32px' }}
              >
                {clients.map((client) => (
                  <SwipeableClientItem 
                    key={client.id}
                    client={client}
                    onEdit={handleOpenForm}
                    onPayment={handlePayment}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
              <div ref={observerTarget} className="h-10 w-full mt-4 flex items-center justify-center">
                {isLoading && page > 1 && <span className="text-gray-500 text-sm">Cargando más...</span>}
                {!hasMore && clients.length > 0 && <span className="text-gray-500 text-sm">Fin de la lista</span>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
