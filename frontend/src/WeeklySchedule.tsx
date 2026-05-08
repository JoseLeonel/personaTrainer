import React from 'react';

type Props = {
  selectedDay: string;
  setDay: (day: string) => void;
};

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function WeeklySchedule({ selectedDay, setDay }: Props) {
  return (
    <div className="glass-panel p-4 rounded-lg mb-4" style={{ borderRadius: 'var(--radius-md)' }}>
      <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap" style={{ WebkitOverflowScrolling: 'touch' }}>
        {days.map((day) => (
          <button
            key={day}
            className={`btn btn-outline flex-shrink-0 min-w-[80px] ${selectedDay === day ? 'bg-primary text-white' : ''}`} 
            onClick={() => setDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="p-2">
        <h3 className="text-lg font-semibold mb-2">Rutina para {selectedDay}</h3>
        <p className="text-sm text-muted">(Ejemplo de rutina para {selectedDay})</p>
        {/* Aquí se mostrará la rutina real del día seleccionado */}
      </div>
    </div>
  );
}
