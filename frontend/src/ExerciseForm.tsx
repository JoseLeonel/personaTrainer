import React, { useState, useEffect } from 'react';

export default function ExerciseForm({ exerciseId, onClose }: { exerciseId: number | null, onClose: (shouldRefresh?: boolean) => void }) {
  const [formData, setFormData] = useState<any>({
    name: '',
    primaryMuscleGroup: '',
    secondaryMuscleGroup: '',
    exerciseType: '',
    difficultyLevel: '',
    equipment: '',
    description: '',
    executionInstructions: '',
    commonMistakes: '',
    sets: 3,
    repetitions: '10-12',
    cadence: '2-0-2-0',
    rir: '2',
    restSeconds: 90,
    timerEnabled: true,
    mainImageUrl: '',
    videoUrl: '',
    externalVideoUrl: '',
    active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (exerciseId) {
      loadExercise();
    }
  }, [exerciseId]);

  const loadExercise = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/exercises/${exerciseId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = value ? parseInt(value) : '';
    }

    setFormData({ ...formData, [name]: finalValue });
  };

  const validate = () => {
    if (!formData.name) return 'El nombre es obligatorio.';
    if (!formData.primaryMuscleGroup) return 'El grupo muscular principal es obligatorio.';
    if (!formData.mainImageUrl) return 'La imagen principal es obligatoria.';
    if (formData.sets <= 0) return 'Las series deben ser mayores a 0.';
    if (!formData.repetitions) return 'Las repeticiones son obligatorias.';
    if (formData.restSeconds < 0) return 'El descanso no puede ser negativo.';
    
    // Cadence validation (Ej: 3-1-1-0)
    if (formData.cadence && !/^\d+-\d+-\d+-\d+$/.test(formData.cadence)) {
      return 'La cadencia debe tener el formato Excéntrica-Pausa-Concéntrica-Pausa (Ej: 3-1-1-0)';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSaving(true);
    
    try {
      const method = exerciseId ? 'PUT' : 'POST';
      const url = exerciseId 
        ? `http://localhost:3000/exercises/${exerciseId}`
        : 'http://localhost:3000/exercises';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onClose(true); // Close and refresh list
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Error al guardar el ejercicio.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="glass-panel w-full" style={{ borderRadius: '24px' }}>
        <div className="flex justify-between items-center mb-6 bg-tertiary p-6 -mt-6 -mx-6 rounded-t-3xl border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">{exerciseId ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h2>
          <button className="btn-icon text-gray-400 hover:text-white" onClick={() => onClose()} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>✕</button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted">Cargando datos...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {error && (
              <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* SECCIÓN 1: Información General */}
            <section>
              <h3 className="text-lg font-bold mb-4 text-orange-500 border-b border-gray-800 pb-2">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Nombre *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Ej: Sentadilla con Barra" required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Grupo Muscular Principal *</label>
                  <select name="primaryMuscleGroup" value={formData.primaryMuscleGroup} onChange={handleChange} className="select-field" required>
                    <option value="">Selecciona...</option>
                    <option value="Pecho">Pecho</option>
                    <option value="Espalda">Espalda</option>
                    <option value="Piernas">Piernas</option>
                    <option value="Hombros">Hombros</option>
                    <option value="Brazos">Brazos</option>
                    <option value="Core">Core</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Nivel de Dificultad</label>
                  <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange} className="select-field">
                    <option value="">Selecciona...</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Equipo Requerido</label>
                  <input type="text" name="equipment" value={formData.equipment} onChange={handleChange} className="input-field" placeholder="Ej: Barra, Mancuernas, Máquina" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">Instrucciones de Ejecución</label>
                  <textarea name="executionInstructions" value={formData.executionInstructions} onChange={handleChange} className="input-field" style={{ minHeight: '100px', borderRadius: '24px' }} placeholder="Paso a paso de cómo realizar el ejercicio..." />
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: Información Técnica */}
            <section>
              <h3 className="text-lg font-bold mb-4 text-orange-500 border-b border-gray-800 pb-2">Información Técnica</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1" title="Cantidad de Series">Series</label>
                  <input type="number" name="sets" value={formData.sets} onChange={handleChange} min="1" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Repeticiones</label>
                  <input type="text" name="repetitions" value={formData.repetitions} onChange={handleChange} placeholder="Ej: 10-12" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1" title="Repeticiones en Reserva">RIR</label>
                  <input type="text" name="rir" value={formData.rir} onChange={handleChange} placeholder="Ej: 2" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1" title="Descanso en segundos">Descanso (seg)</label>
                  <input type="number" name="restSeconds" value={formData.restSeconds} onChange={handleChange} min="0" step="10" className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1" title="Excéntrica-Pausa-Concéntrica-Pausa">Cadencia (Ej: 3-1-1-0)</label>
                  <input type="text" name="cadence" value={formData.cadence} onChange={handleChange} placeholder="3-1-1-0" className="input-field" />
                </div>
                <div className="col-span-2 flex items-center mt-6 px-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="timerEnabled" checked={formData.timerEnabled} onChange={handleChange} className="w-5 h-5 accent-orange-500" />
                    <span className="text-sm font-bold">Activar Cronómetro Automático</span>
                  </label>
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: Multimedia */}
            <section>
              <h3 className="text-lg font-bold mb-4 text-orange-500 border-b border-gray-800 pb-2">Multimedia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">URL Imagen Principal *</label>
                  <input type="url" name="mainImageUrl" value={formData.mainImageUrl} onChange={handleChange} className="input-field" placeholder="https://..." required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">URL Video Demostrativo (MP4)</label>
                  <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">URL Video Externo (YouTube)</label>
                  <input type="url" name="externalVideoUrl" value={formData.externalVideoUrl} onChange={handleChange} className="input-field" placeholder="https://youtube.com/..." />
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-4 mt-6 border-t border-gray-800 pt-6">
              <button 
                type="button" 
                onClick={() => onClose()} 
                className="btn"
                style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn btn-accent disabled:opacity-50"
                style={{ boxShadow: '0 4px 14px 0 rgba(255, 79, 0, 0.39)' }}
              >
                {isSaving ? 'Guardando...' : 'Guardar Ejercicio'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
