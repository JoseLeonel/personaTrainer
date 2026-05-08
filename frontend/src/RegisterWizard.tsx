import { useState, useEffect } from 'react';
import { API_URL } from './config';

export default function RegisterWizard({ onComplete, onCancel }: { onComplete: () => void, onCancel?: () => void }) {
  const [step, setStep] = useState(1);
  const [trainers, setTrainers] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [upperPhoto, setUpperPhoto] = useState<File | null>(null);
  const [lowerPhoto, setLowerPhoto] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    inviteCode: '',
    dob: '',
    gender: 'MALE',
    currentWeight: '',
    height: '',
    mainGoal: 'LOSE_FAT',
    experienceLevel: 'BEGINNER',
    injuries: '',
    trainingDays: '3',
    dietType: 'Normal',
  });

  useEffect(() => {
    // Ya no necesitamos cargar los entrenadores
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        inviteCode: formData.inviteCode,
        currentWeight: parseFloat(formData.currentWeight),
        height: parseFloat(formData.height),
        trainingDays: parseInt(formData.trainingDays, 10),
      };

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error en el registro');
      }

      const userData = await res.json();
      const clientId = userData.id;

      // Upload photos if any
      if (upperPhoto) {
        const formData = new FormData();
        formData.append('file', upperPhoto);
        formData.append('photoType', 'UPPER_BODY');
        await fetch(`${API_URL}/clients/${clientId}/photos`, {
          method: 'POST',
          body: formData,
        });
      }

      if (lowerPhoto) {
        const formData = new FormData();
        formData.append('file', lowerPhoto);
        formData.append('photoType', 'LOWER_BODY');
        await fetch(`${API_URL}/clients/${clientId}/photos`, {
          method: 'POST',
          body: formData,
        });
      }

      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ paddingTop: '40px' }}>
      <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="E-Forge Logo" style={{ width: '60px', height: '60px', borderRadius: '12px' }} />
      </div>
      
      <h1 className="text-2xl text-center mb-2">Comienza tu Evolución</h1>
      <p className="text-muted text-center mb-6">Paso {step} de 5</p>

      {/* Progress Bar */}
      <div className="w-full bg-tertiary mb-8" style={{ height: '6px', borderRadius: '3px' }}>
        <div style={{ width: `${(step / 5) * 100}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-md" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
          <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>{error}</p>
        </div>
      )}

      <div className="glass-panel">
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Datos de la Cuenta</h2>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input type="text" className="input-field" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ej. Juan" />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input type="text" className="input-field" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ej. Pérez" />
            </div>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" className="input-field" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" className="input-field" name="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Código de Invitación del Entrenador</label>
              <input 
                type="text" 
                className="input-field" 
                name="inviteCode" 
                value={formData.inviteCode} 
                onChange={(e) => setFormData(prev => ({...prev, inviteCode: e.target.value.toUpperCase()}))} 
                placeholder="Ej. 12345678A" 
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            
            <div className="flex gap-4 mt-4">
              {onCancel && (
                <button className="btn btn-outline w-full" onClick={onCancel}>
                  Volver
                </button>
              )}
              <button 
                className="btn btn-accent w-full" 
                onClick={nextStep}
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.inviteCode}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Datos Físicos</h2>
            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento</label>
              <input type="date" className="input-field" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="flex gap-4">
              <div className="form-group w-full">
                <label className="form-label">Peso (kg)</label>
                <input type="number" step="0.1" className="input-field" name="currentWeight" value={formData.currentWeight} onChange={handleChange} placeholder="Ej. 75.5" />
              </div>
              <div className="form-group w-full">
                <label className="form-label">Estatura (cm)</label>
                <input type="number" className="input-field" name="height" value={formData.height} onChange={handleChange} placeholder="Ej. 175" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Género</label>
              <select className="select-field" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Femenino</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>

            <div className="flex gap-4 mt-4">
              <button className="btn btn-outline w-full" onClick={prevStep}>Atrás</button>
              <button 
                className="btn btn-accent w-full" 
                onClick={nextStep}
                disabled={!formData.dob || !formData.currentWeight || !formData.height}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Objetivos</h2>
            <div className="form-group">
              <label className="form-label">Objetivo Principal</label>
              <select className="select-field" name="mainGoal" value={formData.mainGoal} onChange={handleChange}>
                <option value="LOSE_FAT">Pérdida de Grasa</option>
                <option value="GAIN_MUSCLE">Ganancia Muscular</option>
                <option value="RECOMPOSITION">Recomposición Corporal</option>
                <option value="HEALTH">Salud General</option>
                <option value="PERFORMANCE">Rendimiento Deportivo</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nivel de Experiencia</label>
              <select className="select-field" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                <option value="BEGINNER">Principiante (0-1 año)</option>
                <option value="INTERMEDIATE">Intermedio (1-3 años)</option>
                <option value="ADVANCED">Avanzado (+3 años)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Días disponibles por semana</label>
              <input type="number" className="input-field" name="trainingDays" value={formData.trainingDays} onChange={handleChange} min="1" max="7" />
            </div>

            <div className="flex gap-4 mt-4">
              <button className="btn btn-outline w-full" onClick={prevStep}>Atrás</button>
              <button className="btn btn-accent w-full" onClick={nextStep}>Continuar</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Salud y Nutrición</h2>
            <div className="form-group">
              <label className="form-label">Lesiones o Condiciones Médicas (Opcional)</label>
              <textarea 
                className="input-field" 
                name="injuries" 
                value={formData.injuries} 
                onChange={handleChange} 
                placeholder="Ej. Dolor en rodilla derecha al correr..."
                rows={3}
              ></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de Dieta</label>
              <select className="select-field" name="dietType" value={formData.dietType} onChange={handleChange}>
                <option value="Normal">Normal (Omnívoro)</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Vegano">Vegano</option>
                <option value="Keto">Keto</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="btn btn-outline w-full" onClick={prevStep}>Atrás</button>
              <button 
                className="btn btn-accent w-full" 
                onClick={nextStep}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Fotos de Progreso (Opcional)</h2>
            <p className="text-sm text-muted mb-6">Selecciona o arrastra una foto para cada zona. Se mostrará una vista previa y podrás cambiarla.</p>
            
            {/* Upper Body Photo */}
            <div className="form-group mb-4">
              <label className="form-label mb-2">Parte Superior (Torso/Frente)</label>
              <div className="flex items-center gap-4">
                {upperPhoto ? (
                  <img src={URL.createObjectURL(upperPhoto)} alt="Upper" className="mobile-photo-preview" />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-tertiary rounded-lg border">
                    <span className="text-muted">Sin foto</span>
                  </div>
                )}
                <label htmlFor="upperPhotoInput" className="btn btn-primary btn-icon" style={{ borderRadius: 'var(--radius-full)', padding: '8px 12px' }}>
                  {upperPhoto ? 'Cambiar' : 'Agregar'}
                </label>
                <span className="text-sm text-muted ml-2">(opcional)</span>
                <input id="upperPhotoInput" type="file" accept="image/*" className="hidden" onChange={(e) => setUpperPhoto(e.target.files?.[0] || null)} />
              </div>
            </div>

            {/* Lower Body Photo */}
            <div className="form-group mb-6">
              <label className="form-label mb-2">Parte Inferior (Piernas)</label>
              <div className="flex items-center gap-4">
                {lowerPhoto ? (
                  <img src={URL.createObjectURL(lowerPhoto)} alt="Lower" className="mobile-photo-preview" />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-tertiary rounded-lg border">
                    <span className="text-muted">Sin foto</span>
                  </div>
                )}
                <label htmlFor="lowerPhotoInput" className="btn btn-primary btn-icon" style={{ borderRadius: 'var(--radius-full)', padding: '8px 12px' }}>
                  {lowerPhoto ? 'Cambiar' : 'Agregar'}
                </label>
                <span className="text-sm text-muted ml-2">(opcional)</span>
                <input id="lowerPhotoInput" type="file" accept="image/*" className="hidden" onChange={(e) => setLowerPhoto(e.target.files?.[0] || null)} />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="btn btn-outline w-full" onClick={prevStep}>Atrás</button>
              <button 
                className="btn btn-accent w-full" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Finalizando...' : 'Finalizar Registro'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
