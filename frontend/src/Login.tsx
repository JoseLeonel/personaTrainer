import { API_URL } from './config';
import { useState } from 'react';

export default function Login({ onLogin, onRegisterClick }: { onLogin: (user: any) => void, onRegisterClick: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al iniciar sesión');
      }

      const userData = await res.json();
      onLogin(userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container animate-fade-in flex flex-col justify-center" style={{ minHeight: '100vh', paddingBottom: '20px' }}>
      <div className="flex flex-col items-center mb-8">
        <img src="/logo.png" alt="E-Forge Logo" style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '16px' }} />
        <h1 className="text-2xl font-bold">E-Forge</h1>
        <p className="text-muted text-center mt-2" style={{ fontSize: 'clamp(0.8rem, 4vw, 1rem)', padding: '0 10px' }}>
          Forja fuerza, disciplina y una nueva versión de ti
        </p>
      </div>

      <div className="glass-panel w-full">
        <h2 className="text-xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="p-3 mb-4 rounded-md" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>{error}</p>
          </div>
        )}

        {/* Standard Email Form */}
        <div className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field" 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field" 
          />
          <div className="flex justify-end">
            <span className="text-sm cursor-pointer hover:underline" style={{ color: 'var(--text-secondary)' }}>
              ¿Olvidaste tu clave?
            </span>
          </div>
          <button 
            className="btn btn-accent w-full mt-2" 
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          ¿No tienes cuenta?{' '}
          <span 
            className="font-semibold cursor-pointer" 
            style={{ color: 'var(--accent-primary)' }}
            onClick={onRegisterClick}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}
