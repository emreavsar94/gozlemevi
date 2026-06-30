// src/components/controls/CustomTimePicker.jsx
import React, { useEffect, useRef, useState } from 'react';

const ITEM_HEIGHT = 28;

export default function CustomTimePicker({ isTimeOpen, currentDate, setCurrentDate, setIsManualTime }) {
  if (!isTimeOpen) return null;

  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  const handleTimeSelect = (type, value) => {
    setIsManualTime(true);
    setCurrentDate(prev => {
      const next = new Date(prev);
      if (type === 'hour') next.setHours(value);
      if (type === 'minute') next.setMinutes(value);
      return next;
    });
  };

  return (
    <div 
      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[300px] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-4 animate-fadeIn z-[61] select-none"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <style>{`
        .wheel-scrollbar::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
        .wheel-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>

      <div className="relative h-[140px] flex justify-center items-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-900 via-slate-900/20 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent pointer-events-none z-10" />
        
        <div className="absolute left-8 right-8 top-[56px] h-[28px] bg-indigo-600 border border-indigo-500/30 rounded-lg pointer-events-none shadow-lg shadow-indigo-600/20 z-0" />

        {/* SAAT ÇARKI */}
        <div className="w-[80px] h-full relative flex justify-center">
          <ScrollWheel 
            totalItems={24} 
            currentValue={currentHours} 
            onChange={(val) => handleTimeSelect('hour', val)} 
          />
        </div>

        {/* İki Nokta Üst Üste Ayracı */}
        <div className="text-slate-400 font-bold text-sm px-2 mb-0.5 z-20 shrink-0 select-none">:</div>

        {/* DAKİKA ÇARKI */}
        <div className="w-[80px] h-full relative flex justify-center">
          <ScrollWheel 
            totalItems={60} 
            currentValue={currentMinutes} 
            onChange={(val) => handleTimeSelect('minute', val)} 
          />
        </div>
      </div>
    </div>
  );
}

function ScrollWheel({ totalItems, currentValue, onChange }) {
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const pointerCoordsRef = useRef({ startY: 0, startScrollTop: 0, hasMoved: false });
  
  const [isDragging, setIsDragging] = useState(false);

  const loopMultiplier = 20;
  const items = Array.from({ length: totalItems * loopMultiplier }, (_, i) => i % totalItems);
  const centerOffset = totalItems * Math.floor(loopMultiplier / 2);

  const [visualCenterIndex, setVisualCenterIndex] = useState(currentValue + centerOffset);

  useEffect(() => {
    if (containerRef.current && !isDragging) {
      const targetScroll = (currentValue + centerOffset) * ITEM_HEIGHT;
      if (Math.abs(containerRef.current.scrollTop - targetScroll) > 2) {
        containerRef.current.scrollTop = targetScroll;
      setVisualCenterIndex(currentValue + centerOffset);
    }
    }
  }, [currentValue, isDragging, centerOffset]);

  const handleScroll = (e) => {
    const container = e.target;
    const scrollTop = container.scrollTop;
    const centerIndex = Math.round(scrollTop / ITEM_HEIGHT);
    
    setVisualCenterIndex(centerIndex);

    const calculatedValue = ((centerIndex % totalItems) + totalItems) % totalItems;

    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (calculatedValue !== currentValue) {
        onChange(calculatedValue);
      }

    if (centerIndex < totalItems * 3 || centerIndex > totalItems * (loopMultiplier - 3)) {
      container.scrollTop = (calculatedValue + centerOffset) * ITEM_HEIGHT;
    }
    }, 45);
  };

  // GLOBAL WINDOW LISTENERS 
  useEffect(() => {
    const handleGlobalPointerMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const deltaY = e.clientY - pointerCoordsRef.current.startY;
      
      if (Math.abs(deltaY) > 4) {
        pointerCoordsRef.current.hasMoved = true;
      }
      containerRef.current.scrollTop = pointerCoordsRef.current.startScrollTop - deltaY;
    };

    const handleGlobalPointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    pointerCoordsRef.current = {
      startY: e.clientY,
      startScrollTop: containerRef.current.scrollTop,
      hasMoved: false
    };
  };

  const handleItemClick = (index) => {
    if (!pointerCoordsRef.current.hasMoved && containerRef.current) {
      containerRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth'
      });
    }
  };

  const containerCursor = isDragging ? 'cursor-grabbing' : 'cursor-grab';

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      className={`w-full h-full overflow-y-auto wheel-scrollbar flex flex-col py-[56px] snap-y snap-mandatory z-10 select-none touch-none ${containerCursor}`}
    >
      {items.map((val, index) => {
        const distance = Math.abs(index - visualCenterIndex);
        let visualStyle = 'opacity-0 scale-75 pointer-events-none';
        let buttonCursor = containerCursor;

        if (distance === 0) {
          visualStyle = 'text-white font-bold opacity-100 scale-105'; 
          if (!isDragging) buttonCursor = 'cursor-grab';
        } else if (distance === 1) {
          visualStyle = 'text-slate-300 font-medium opacity-60 scale-95 hover:text-slate-200'; 
          if (!isDragging) buttonCursor = 'cursor-pointer';
        } else if (distance === 2) {
          visualStyle = 'text-slate-500 font-normal opacity-25 scale-85 hover:text-slate-300'; 
          if (!isDragging) buttonCursor = 'cursor-pointer';
        }

        return (
          <div 
            key={`${val}-${index}`}
            className="h-[28px] shrink-0 flex items-center justify-center snap-center"
          >
            <button
              onPointerUp={() => handleItemClick(index)}
              className={`h-full w-full flex items-center justify-center text-sm transition-all duration-150 font-medium bg-transparent border-0 outline-none p-0 ${visualStyle} ${buttonCursor}`}
            >
              {val.toString().padStart(2, '0')}
            </button>
          </div>
        );
      })}
    </div>
  );
}