// src/components/controls/CustomCalendar.jsx

import React, { useContext } from 'react';
import { SimulationContext } from '../../context/SimulationContext';
import { MONTHS, YEARS } from '../../constants/astronomyData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomCalendar({ setIsManualTime }) {
  const { currentDate, setCurrentDate, isCalendarOpen, setIsCalendarOpen } = useContext(SimulationContext);

  if (!isCalendarOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentSeconds = currentDate.getSeconds();

  const setSafeDate = (y, m) => {
    if (setIsManualTime) setIsManualTime(true); 
    const currentDay = currentDate.getDate();
    const daysInNewMonth = new Date(y, m + 1, 0).getDate();
    const safeDay = Math.min(currentDay, daysInNewMonth);
    setCurrentDate(new Date(y, m, safeDay, currentHours, currentMinutes, currentSeconds));
  };
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1; 
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: startDay }, (_, i) => i);
  
  const totalSlots = 42; 
  const trailingBlanksCount = totalSlots - (leadingBlanks.length + days.length);
  const trailingBlanks = Array.from({ length: trailingBlanksCount }, (_, i) => i);

  return (
    <div 
       className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[300px] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-4 animate-fadeIn z-[60] cursor-default select-none"
       onClick={(e) => e.stopPropagation()}
       onPointerDown={(e) => e.stopPropagation()}
    >
      <style>{`
        select::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
        select { -ms-overflow-style: none !important; scrollbar-width: none !important; appearance: none; }
        option { background-color: #0f172a; color: white; }
      `}</style>

      <div className="flex justify-between items-center mb-4 border-b border-slate-800/80 pb-3">
         <button onClick={() => setSafeDate(year, month - 1)} className="p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><ChevronLeft size={16}/></button>
         <div className="flex gap-1.5">
           <select 
              value={month} 
              onChange={(e) => setSafeDate(year, parseInt(e.target.value))}
              className="w-[110px] bg-slate-800 text-white font-medium border border-slate-700/50 rounded-lg px-2 py-1.5 text-sm outline-none cursor-pointer text-center hover:bg-slate-700 transition-colors"
            >
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
           </select>
           <select 
              value={year} 
              onChange={(e) => setSafeDate(parseInt(e.target.value), month)}
              className="w-[80px] bg-slate-800 text-white font-medium border border-slate-700/50 rounded-lg px-2 py-1.5 text-sm outline-none cursor-pointer text-center hover:bg-slate-700 transition-colors"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
           </select>
         </div>
         <button onClick={() => setSafeDate(year, month + 1)} className="p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"><ChevronRight size={16}/></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
         {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => <span key={d} className="text-slate-500 text-[10px] font-bold tracking-wider">{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
         {leadingBlanks.map(b => <div key={`lb-${b}`} className="h-9" />)}
         {days.map(d => {
           const isSelected = d === currentDate.getDate();
           return (
             <button 
               key={d} 
               onClick={() => {
                 if (setIsManualTime) setIsManualTime(true);
                 setCurrentDate(new Date(year, month, d, currentHours, currentMinutes, currentSeconds));
                 setIsCalendarOpen(false);
               }}
               className={`h-9 w-full rounded-lg text-sm transition-all flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 scale-105' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
             >
               {d}
             </button>
           )
         })}
         {trailingBlanks.map(b => <div key={`tb-${b}`} className="h-9" />)}
      </div>
    </div>
  );
}