// src/components/controls/BottomControls.jsx

import React, { useContext, useState, useRef, useEffect } from 'react';
import { SimulationContext } from '../../context/SimulationContext';
import CustomCalendar from './CustomCalendar';
import CustomTimePicker from './CustomTimePicker';
import { ChevronLeft, ChevronRight, Calendar, Pause, Play, RefreshCcw, Clock } from 'lucide-react';

export default function BottomControls() {
  const { 
    currentDate, setCurrentDate, 
    isPlaying, setIsPlaying, 
    isCalendarOpen, setIsCalendarOpen, 
    modalView, setCamera,
    selectedBodyId 
  } = useContext(SimulationContext);
  
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isManualTime, setIsManualTime] = useState(false); 
  const [frozenDisplayTime, setFrozenDisplayTime] = useState(null);
  
  const containerRef = useRef(null); 
  const dateTimeoutRef = useRef(null);
  const dateIntervalRef = useRef(null);
  const lastRealTimeRef = useRef(Date.now());

  useEffect(() => {
    lastRealTimeRef.current = Date.now();

    const updateClock = () => {
      const now = Date.now();
      const delta = now - lastRealTimeRef.current;
      lastRealTimeRef.current = now;

      if (!isPlaying && !isManualTime) {
        setCurrentDate(prev => new Date(prev.getTime() + delta));
      }
    };

    const intervalId = setInterval(updateClock, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isPlaying && !isManualTime) {
        const now = Date.now();
        const delta = now - lastRealTimeRef.current;
        setCurrentDate(prev => new Date(prev.getTime() + delta));
      }
      lastRealTimeRef.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying, isManualTime, setCurrentDate]);

  useEffect(() => {
    return () => {
      clearTimeout(dateTimeoutRef.current);
      clearInterval(dateIntervalRef.current);
    };
  }, []);

  // Play basıldığı an saat metnini dondurma
  useEffect(() => {
    if (isPlaying) {
      setFrozenDisplayTime(currentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    } else {
      setFrozenDisplayTime(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closePanels();
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (selectedBodyId || modalView) closePanels();
  }, [selectedBodyId, modalView]);

  const closePanels = () => {
    setIsCalendarOpen(false);
    setIsTimeOpen(false);
  };

  const changeDateByDays = (days) => {
    setIsPlaying(false);
    setIsManualTime(true);
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + days);
      return next;
    });
  };

  const handleDatePress = (delta) => {
    if (isPlaying) return;
    closePanels(); 
    changeDateByDays(delta);
    dateTimeoutRef.current = setTimeout(() => {
      dateIntervalRef.current = setInterval(() => changeDateByDays(delta), 40);
    }, 300);
  };

  const clearDatePress = () => {
    clearTimeout(dateTimeoutRef.current);
    clearInterval(dateIntervalRef.current);
  };

  const handleResetOrLocate = () => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    setCamera({ x: 0, y: 60, zoom: isMobile ? 1.8 : 0.9 });
    
    setIsPlaying(false); 
    setIsManualTime(false);
    setCurrentDate(new Date()); 
    closePanels();
  };

  const formattedDateLong = currentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedDateShort = currentDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  const formattedTime = isPlaying && frozenDisplayTime 
    ? frozenDisplayTime 
    : currentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      ref={containerRef}
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] no-drag w-[95%] max-w-[26rem] transition-opacity duration-300 ${modalView === 'compare' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <CustomCalendar setIsManualTime={setIsManualTime} />

      <CustomTimePicker 
        isTimeOpen={isTimeOpen} 
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setIsManualTime={setIsManualTime}
      />

      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/60 shadow-2xl flex items-stretch justify-between gap-1.5">
        
        {/* PLAY / PAUSE BUTTON */}
        <button 
          onClick={() => { 
            setIsManualTime(true); 
            setIsPlaying(!isPlaying); 
            closePanels(); 
          }} 
          className={`px-3.5 flex items-center justify-center rounded-xl transition-all border shadow-lg shrink-0 ${isPlaying ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300 border-slate-700/50'}`} 
          title="Zamanı Akıt"
        >
           {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        {/* MERKEZİ GÖSTERGE ALANI */}
        <div className="flex items-center flex-1 bg-slate-800/30 rounded-xl border border-slate-700/50 transition-colors px-0.5 justify-between min-w-0">
          <button 
             onPointerDown={() => handleDatePress(-1)} onPointerUp={clearDatePress} onPointerLeave={clearDatePress} onTouchEnd={clearDatePress} 
             className={`p-2 transition-colors select-none shrink-0 ${isPlaying ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
             disabled={isPlaying}
          ><ChevronLeft size={16} /></button>
          
          <div className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 divide-x divide-slate-800/60 py-1 sm:py-2.5 select-none text-[11px] sm:text-xs font-semibold tracking-wide min-w-0">
             
             <button 
               onClick={(e) => { e.stopPropagation(); if (!isPlaying) { setIsTimeOpen(false); setIsCalendarOpen(!isCalendarOpen); } }}
               className={`flex items-center justify-center gap-1 px-1 py-0.5 rounded-lg transition-colors min-w-0 truncate ${isPlaying ? 'opacity-40 cursor-not-allowed text-slate-500' : 'text-white hover:bg-slate-800/50'}`}
               disabled={isPlaying}
             >
               <Calendar size={13} className="text-indigo-400 shrink-0 pointer-events-none" />
               <span className="truncate hidden sm:inline">{formattedDateLong}</span>
               <span className="truncate sm:hidden">{formattedDateShort}</span>
             </button>

             <button 
               onClick={(e) => { e.stopPropagation(); if (!isPlaying) { setIsCalendarOpen(false); setIsTimeOpen(!isTimeOpen); } }}
               className={`flex items-center justify-center pl-1.5 sm:pl-2 pr-1 py-0.5 rounded-lg transition-colors shrink-0 ${isPlaying ? 'opacity-40 cursor-not-allowed text-slate-500' : 'text-white hover:bg-slate-800/50'} ${isTimeOpen ? 'bg-slate-800/80 text-white' : ''}`}
               disabled={isPlaying}
             >
               <Clock size={13} className="text-indigo-400 mr-1 shrink-0 pointer-events-none" />
               <span className="font-mono tracking-wide">{formattedTime}</span>
               
               <span className={`w-1.5 h-1.5 rounded-full ml-1.5 shrink-0 transition-all duration-300 ${(isManualTime || isPlaying) ? 'bg-indigo-500 animate-pulse scale-100' : 'bg-slate-700/20 scale-75 opacity-0'}`} />
             </button>
          </div>

          <button 
             onPointerDown={() => handleDatePress(1)} onPointerUp={clearDatePress} onPointerLeave={clearDatePress} onTouchEnd={clearDatePress} 
             className={`p-2 transition-colors select-none shrink-0 ${isPlaying ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
             disabled={isPlaying}
          ><ChevronRight size={16} /></button>
        </div>

        {/* SIFIRLAMA BUTONU */}
        <button 
          onClick={handleResetOrLocate} 
          className="px-3.5 flex items-center justify-center bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-xl transition-all border border-indigo-500/30 shrink-0" 
          title="Her Şeyi Bugüne Sıfırla"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

    </div>
  );
}