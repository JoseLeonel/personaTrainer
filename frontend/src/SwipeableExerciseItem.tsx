import React, { useState, useRef } from 'react';

interface Exercise {
  id: number;
  name: string;
  primaryMuscleGroup: string;
  difficultyLevel: string;
  equipment: string;
  mainImageUrl: string;
  active: boolean;
  restSeconds?: number;
  sets?: number;
  repetitions?: number;
}

interface Props {
  exercise: Exercise;
  onEdit: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export default function SwipeableExerciseItem({ exercise, onEdit, onToggleStatus }: Props) {
  const [offsetX, setOffsetX] = useState(0);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  
  const threshold = -60;
  const maxSwipe = -150;

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
        height: '320px', // Fixed height for consistency
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Background Actions Layer */}
      <div 
        style={{ 
          position: 'absolute', top: 0, bottom: 0, right: 0, width: '100%', zIndex: 0, 
          background: 'linear-gradient(90deg, rgba(31,31,31,0) 0%, rgba(20,20,20,1) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px', gap: '16px'
        }}
      >
        <button 
          onClick={() => { resetSwipe(); onEdit(exercise.id); }} 
          title="Editar"
          style={{ 
            width: '50px', height: '50px', borderRadius: '50%', border: 'none', cursor: 'pointer', outline: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            background: '#0ea5e9',
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)' 
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          onClick={() => { resetSwipe(); onToggleStatus(exercise.id); }} 
          title={exercise.active ? "Inactivar" : "Activar"}
          style={{ 
            width: '50px', height: '50px', borderRadius: '50%', border: 'none', cursor: 'pointer', outline: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            background: exercise.active ? '#ef4444' : '#10b981',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)' 
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Foreground Content Layer */}
      <div 
        className={`${!exercise.active ? 'grayscale opacity-60' : ''}`}
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
        {/* Top Image */}
        <div 
          style={{ 
            height: '160px', width: '100%', 
            backgroundImage: `url(${exercise.mainImageUrl || '/placeholder-exercise.png'})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            position: 'relative', flexShrink: 0
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)' }}></div>
          
          {/* Badge */}
          <span 
            style={{ 
              position: 'absolute', top: '16px', right: '16px', 
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              padding: '6px 12px', borderRadius: '9999px',
              fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-primary)',
              border: '1px solid rgba(255, 79, 0, 0.3)'
            }}
          >
            {exercise.primaryMuscleGroup || 'N/A'}
          </span>

          {!exercise.active && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444', background: 'rgba(0,0,0,0.8)', padding: '4px 12px', borderRadius: '8px' }}>
                INACTIVO
              </span>
            </div>
          )}
        </div>
        
        {/* Bottom Info */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'white', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {exercise.name}
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4b5563', flexShrink: 0 }}></span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exercise.difficultyLevel || 'N/A'}</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4b5563', flexShrink: 0 }}></span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exercise.equipment || 'N/A'}</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4b5563', flexShrink: 0 }}></span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exercise.restSeconds ? `${exercise.restSeconds}s` : 'N/A'}</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4b5563', flexShrink: 0 }}></span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exercise.sets ? `${exercise.sets}x${exercise.repetitions}` : 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
