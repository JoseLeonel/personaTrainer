import React, { useState, useRef } from 'react';

export interface ClientData {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  profile?: {
    photoUrl?: string;
    mainGoal?: string;
    initialBodyFat?: number;
    bodyFat?: number;
    trainingDaysCount?: number;
    servicePrice?: number;
    chargeType?: string;
  };
  lostBodyFat?: number;
  paymentStatus?: string;
  nextPaymentDate?: string;
}

interface Props {
  client: ClientData;
  onEdit: (id: number) => void;
  onPayment: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export default function SwipeableClientItem({ client, onEdit, onPayment, onToggleStatus }: Props) {
  const [offsetX, setOffsetX] = useState(0);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  
  const threshold = -60;
  const maxSwipe = -220; // Needs more space for 3 buttons (Edit, Payment, Status)

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    currentXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentXRef.current - startXRef.current;
    
    if (diff < 0) {
      setOffsetX(Math.max(diff, maxSwipe));
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (offsetX < threshold) {
      setOffsetX(maxSwipe);
    } else {
      setOffsetX(0);
    }
    startXRef.current = null;
    currentXRef.current = null;
  };

  const resetSwipe = () => {
    setOffsetX(0);
  };

  const isActive = client.status === 'ACTIVE';
  const isUpToDate = client.paymentStatus === 'PAID';
  
  // Format the chargeType
  const formatChargeType = (type?: string) => {
    switch(type) {
      case 'DAILY': return 'Diario';
      case 'WEEKLY': return 'Semanal';
      case 'BIWEEKLY': return 'Quincenal';
      case 'MONTHLY': return 'Mensual';
      default: return 'No definido';
    }
  };

  // Format the main Goal
  const formatGoal = (goal?: string) => {
    switch(goal) {
      case 'LOSE_FAT': return 'Bajar grasa';
      case 'GAIN_MUSCLE': return 'Ganar masa';
      case 'RECOMPOSITION': return 'Recomposición';
      case 'PERFORMANCE': return 'Rendimiento';
      case 'HEALTH': return 'Salud/Rehab';
      default: return 'General';
    }
  };

  return (
    <div 
      className="group"
      onMouseLeave={() => setOffsetX(0)}
      style={{ 
        position: 'relative', 
        borderRadius: '24px', 
        background: 'rgba(20,20,25,0.7)', 
        border: '1px solid rgba(255,255,255,0.08)', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Background Actions Layer */}
      <div 
        style={{ 
          position: 'absolute', top: 0, bottom: 0, right: 0, width: '100%', zIndex: 0, 
          background: 'linear-gradient(90deg, rgba(31,31,31,0) 0%, rgba(20,20,20,1) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '16px', gap: '12px'
        }}
      >
        <button 
          onClick={() => { resetSwipe(); onEdit(client.id); }} 
          title="Editar"
          style={{ 
            width: '45px', height: '45px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            background: '#0ea5e9', boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)' 
          }}
        >
          ✏️
        </button>
        <button 
          onClick={() => { resetSwipe(); onPayment(client.id); }} 
          title="Registrar Pago"
          style={{ 
            width: '45px', height: '45px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            background: '#eab308', boxShadow: '0 4px 14px rgba(234, 179, 8, 0.4)' 
          }}
        >
          💰
        </button>
        <button 
          onClick={() => { resetSwipe(); onToggleStatus(client.id); }} 
          title={isActive ? "Desactivar" : "Activar"}
          style={{ 
            width: '45px', height: '45px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            background: isActive ? '#ef4444' : '#10b981', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' 
          }}
        >
          {isActive ? '🚫' : '✅'}
        </button>
      </div>

      {/* Foreground Content Layer */}
      <div 
        className={`${!isActive ? 'grayscale opacity-60' : ''}`}
        style={{ 
          position: 'relative',
          transform: `translateX(${offsetX}px)`, zIndex: 1, touchAction: 'pan-y', 
          height: '100%', width: '100%',
          background: 'var(--bg-tertiary)',
          display: 'flex', flexDirection: 'column',
          transition: isDraggingRef.current ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: isDraggingRef.current ? 'grabbing' : 'grab'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
      >
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Header: Photo and Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
              backgroundImage: `url(${client.profile?.photoUrl || '/placeholder-avatar.png'})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '2px solid rgba(255,255,255,0.1)'
            }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                {client.firstName} {client.lastName}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#9ca3af' }}>
                Objetivo: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{formatGoal(client.profile?.mainGoal)}</span>
              </p>
            </div>
          </div>

          {/* Emojis Status Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#e5e7eb' }}>
              {isActive ? '🟢 Activo' : '🔴 Inactivo'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#e5e7eb' }}>
              {isUpToDate ? '💰 Pago al día' : '⚠ Pendiente'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#e5e7eb' }}>
              🔥 {client.lostBodyFat || 0}% grasa perdida
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#e5e7eb' }}>
              📅 Entrena hace {client.profile?.trainingDaysCount || 0} días
            </div>
          </div>
          
          {/* Bottom Grid Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Grasa inicial: <strong style={{ color: 'white' }}>{client.profile?.initialBodyFat || 0}%</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Grasa actual: <strong style={{ color: 'white' }}>{client.profile?.bodyFat || 0}%</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Precio: <strong style={{ color: 'white' }}>₡{client.profile?.servicePrice || 0}</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Cobro: <strong style={{ color: 'white' }}>{formatChargeType(client.profile?.chargeType)}</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
