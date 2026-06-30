//src/components/modals/SkyMapModal.jsx

import React, { useContext } from 'react';
import { SimulationContext } from '../../context/SimulationContext';
import { calculateSkyVisibility } from '../../utils/astronomyMath';

export default function SkyMapModal() {
  const { planets, earth, currentDate, skyLocation } = useContext(SimulationContext);

  if (!earth) return null;

  const visiblePlanets = calculateSkyVisibility(planets, earth, currentDate, skyLocation.lon);
  const visibleNow = visiblePlanets.filter(p => p.isVisible);

  const getTimezoneOffset = (id) => {
    switch(id) {
      case 'istanbul': return 3;
      case 'london': return 1;
      case 'paris': return 2;
      case 'newyork': return -4;
      case 'tokyo': return 9;
      case 'beijing': return 8;
      case 'cairo': return 2;
      case 'sydney': return 10;
      default: return 3;
    }
  };

  const offset = getTimezoneOffset(skyLocation.id);
  const utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (3600000 * offset));
  const timeStr = localDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full flex flex-col items-center px-5 pb-5 pt-1 h-full justify-between overflow-hidden select-none">
      
      <div className="flex-1 flex items-center justify-center w-full min-h-[230px] my-1">
        <div className="relative w-full max-w-[225px] md:max-w-[235px] aspect-square bg-slate-950 rounded-full border-2 border-indigo-900/50 shadow-[0_0_25px_rgba(59,130,246,0.15)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 border-[20px] border-slate-900/50 rounded-full pointer-events-none" />
          <div className="absolute inset-0 border-[60px] border-slate-900/30 rounded-full pointer-events-none" />
          <div className="absolute w-full h-[1px] bg-indigo-900/40 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-indigo-900/40 pointer-events-none" />
          
          <span className="absolute top-1 text-[9px] text-slate-500 font-bold">K</span>
          <span className="absolute bottom-1 text-[9px] text-slate-500 font-bold">G</span>
          <span className="absolute left-1 text-[9px] text-slate-500 font-bold">D</span>
          <span className="absolute right-1 text-[9px] text-slate-500 font-bold">B</span>
          
          {visibleNow.length === 0 ? (
            <p className="text-slate-600 text-[10px] text-center px-6">Ufuk çizgisinin üzerinde gök cismi yok.</p>
          ) : (
            visibleNow.map(p => {
              const index = planets.findIndex(x => x.id === p.id);
              const r = 55 + (index >= 0 ? index * 5.8 : 18);
              const x = Math.sin(p.azimuthApprox) * r;
              const y = -Math.cos(p.azimuthApprox) * r;
              return (
                <div key={p.id} className="absolute flex flex-col items-center" style={{ transform: `translate(${x}px, ${y}px)` }}>
                  <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_4px_currentColor]" style={{ backgroundColor: p.color, color: p.color }} />
                  <span className="text-[8px] text-white bg-slate-900/90 px-1 rounded border border-slate-700 mt-0.5 whitespace-nowrap">{p.name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1 font-mono text-[10px] text-slate-400 shrink-0 shadow-inner">
        <div className="flex justify-between border-b border-slate-900 pb-0.5">
          <span className="text-slate-500">GÖZLEM KOORDİNATI:</span>
          <span className="text-slate-300">{skyLocation.lat.toFixed(2)}° K / {skyLocation.lon.toFixed(2)}° D</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">YEREL SAAT:</span>
          <span className="text-indigo-400 font-medium">{timeStr}</span>
        </div>
      </div>
    </div>
  );
}