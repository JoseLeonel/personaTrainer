import React, { useState, useEffect, useRef } from 'react';
import ExerciseForm from './ExerciseForm';
import SwipeableExerciseItem from './SwipeableExerciseItem';
import { API_URL } from './config';

interface Exercise {
  id: number;
  name: string;
  primaryMuscleGroup: string;
  difficultyLevel: string;
  equipment: string;
  mainImageUrl: string;
  active: boolean;
  restSeconds?: number;
}

export default function ExercisesCatalog() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMuscle, setFilterMuscle] = useState('');
  const [filterName, setFilterName] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const limit = 3;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchExercises = async (pageNum: number, reset = false) => {
    if (reset) setIsLoading(true);
    try {
      let url = `${API_URL}/exercises?active=all&limit=${limit}&offset=${(pageNum - 1) * limit}`;
      if (filterMuscle) url += `&primaryMuscleGroup=${encodeURIComponent(filterMuscle)}`;
      if (filterName) url += `&name=${encodeURIComponent(filterName)}`; // Usar filtro backend
      
      const res = await fetch(url);
      const data = await res.json();
      
      setHasMore(data.length === limit);

      if (reset) {
        setExercises(data);
      } else {
        setExercises(prev => {
          const newItems = data.filter((d: Exercise) => !prev.find(p => p.id === d.id));
          return [...prev, ...newItems];
        });
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cuando cambian los filtros, resetear a página 1
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchExercises(1, true);
  }, [filterMuscle, filterName]);

  // Fetch cuando la página cambia por el scroll
  useEffect(() => {
    if (page > 1) {
      fetchExercises(page, false);
    }
  }, [page]);

  // Observer para el Infinite Scroll
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
      fetchExercises(1, true);
    }
  };

  const handleToggleStatus = async (id: number) => {
    if (window.confirm('¿Seguro que deseas cambiar el estado de este ejercicio?')) {
      try {
        const res = await fetch(`${API_URL}/exercises/${id}/status`, {
          method: 'PATCH'
        });
        if (res.ok) {
          fetchExercises(1, true);
        } else {
          alert('Error al actualizar el estado');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {isFormOpen ? (
        <ExerciseForm 
          exerciseId={editingId} 
          onClose={(shouldRefresh) => handleCloseForm(shouldRefresh)} 
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Catálogo de Ejercicios</h2>
              <p className="text-sm text-muted">Mantenimiento de base de datos técnica</p>
            </div>
            <button 
              onClick={() => handleOpenForm()}
              className="btn text-white font-bold transition-transform hover:scale-105"
              style={{ 
                background: 'var(--accent-primary)', 
                borderRadius: '9999px',
                padding: '12px 24px',
                boxShadow: '0 4px 14px 0 rgba(255, 79, 0, 0.39)'
              }}
            >
              + Nuevo Ejercicio
            </button>
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
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value)}
              className="bg-tertiary border border-gray-700 text-white focus:outline-none focus:border-orange-500 w-full md:w-48 appearance-none"
              style={{ padding: '12px 20px', borderRadius: '9999px' }}
            >
              <option value="">Todos los músculos</option>
              <option value="Pecho">Pecho</option>
              <option value="Espalda">Espalda</option>
              <option value="Piernas">Piernas</option>
              <option value="Hombros">Hombros</option>
              <option value="Brazos">Brazos</option>
              <option value="Core">Core</option>
              <option value="Cardio">Cardio</option>
            </select>
          </div>

          {isLoading && exercises.length === 0 ? (
            <div className="text-center py-12 text-muted">Cargando catálogo...</div>
          ) : exercises.length === 0 ? (
            <div className="glass-panel text-center py-12 text-muted" style={{ borderRadius: '24px' }}>
              No se encontraron ejercicios.
            </div>
          ) : (
            <>
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ display: 'grid', gap: '32px' }}
              >
                {exercises.map((ex) => (
                  <SwipeableExerciseItem 
                    key={ex.id}
                    exercise={ex}
                    onEdit={handleOpenForm}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
              {/* Scroll observer target */}
              <div ref={observerTarget} className="h-10 w-full mt-4 flex items-center justify-center">
                {isLoading && page > 1 && <span className="text-gray-500 text-sm">Cargando más...</span>}
                {!hasMore && exercises.length > 0 && <span className="text-gray-500 text-sm">Fin de la lista</span>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
