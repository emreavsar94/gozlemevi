//src/components/modals/DetailModal.jsx

import React, { useContext, useEffect, useState } from 'react';
import { SimulationContext } from '../../context/SimulationContext';
import PlanetTexture from '../view/PlanetTexture';
import { getBodySVGShadowPath } from '../../utils/astronomyMath';
import { Scale, Compass, Zap } from 'lucide-react';

export default function DetailModal() {
  const { activeBody, setModalView, setCompareTargetId } = useContext(SimulationContext);
  const [fotonTime, setFotonTime] = useState({ min: 0, sec: 0 });

  useEffect(() => {
    if (activeBody) {
      const targetTime = activeBody.id === 'earth' ? 499 : activeBody.lightTravelTime;
      if (targetTime) {
        const totalSecs = Math.floor(targetTime);
        setFotonTime({ min: Math.floor(totalSecs / 60), sec: totalSecs % 60 });
      }
    }
  }, [activeBody]);

  const isSpecialBody = activeBody.id === 'sun' || activeBody.id === 'moon';

  return (
    <div className="p-4 sm:p-5 flex flex-col justify-between min-h-full w-full overflow-y-auto md:overflow-hidden select-none custom-scrollbar">
      
      {/* TELESTOP VİZÖR ALANI */}
      <div className="flex-1 flex items-center justify-center relative min-h-[130px] sm:min-h-[140px] my-2">
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="shimmer">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise">
              <animate attributeName="baseFrequency" values="0.015;0.02;0.015" dur="4s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28 overflow-visible drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]" style={{ filter: 'url(#shimmer)' }}>
          <g>
            <PlanetTexture id={activeBody.id} color={activeBody.color} glow={activeBody.glow} hideShadow={true} />
            {activeBody.id !== 'sun' && getBodySVGShadowPath(activeBody.phase) && (
              <path d={getBodySVGShadowPath(activeBody.phase)} fill="rgba(2, 6, 23, 0.85)" className="mix-blend-multiply" />
            )}
          </g>
        </svg>
      </div>

      {/* METRİK PANEL BARI */}
      <div className="mb-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between shadow-inner shrink-0">
        <div className="flex items-center gap-1.5">
          <Zap size={13} className="text-amber-400" />
          <span className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">
            {activeBody.id === 'sun' ? "Gök Cismi Sınıfı" : activeBody.id === 'moon' ? "Yörünge Tipi" : "Işığın Ulaşma Süresi"}
          </span>
        </div>
        <div className="text-amber-400 font-mono text-[11px] tracking-wider font-semibold drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]">
          {activeBody.id === 'sun' && "SİSTEM MERKEZİ / G-TİPİ YILDIZ"}
          {activeBody.id === 'moon' && "DÜNYA'NIN DOĞAL UYDUSU"}
          {!isSpecialBody && `${fotonTime.min} DK ${fotonTime.sec.toString().padStart(2, '0')} SN`}
        </div>
      </div>

      {/* VERİ GRIDLERİ */}
      <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
        <div className="bg-slate-950/40 p-2 sm:p-2.5 rounded-xl flex flex-col items-center border border-slate-800/40">
          <span className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">Aydınlanma</span>
          <span className="text-white text-xs font-medium">%{(activeBody.illumination * 100).toFixed(1)}</span>
        </div>
        <div className="bg-slate-950/40 p-2 sm:p-2.5 rounded-xl flex flex-col items-center border border-slate-800/40">
          <span className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">Parlaklık</span>
          <span className="text-white text-xs font-medium">{activeBody.magnitude}</span>
        </div>
        <div className="bg-slate-950/40 p-2 sm:p-2.5 rounded-xl flex flex-col items-center border border-slate-800/40">
          <span className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">{activeBody.id === 'moon' ? 'Yaş' : 'Periyot'}</span>
          <span className="text-white text-xs font-medium">
             {activeBody.id === 'moon' ? `${Math.round(parseFloat(activeBody.periodText))} Gün` : activeBody.periodText}
          </span>
        </div>
        
        {activeBody.id === 'earth' ? (
           <button onClick={() => setModalView('skyMap')} className="bg-indigo-600/20 hover:bg-indigo-600/30 p-2 rounded-xl flex flex-col items-center justify-center border border-indigo-500/30 transition-colors shadow-inner">
              <Compass size={14} className="text-indigo-400 mb-0.5"/>
              <span className="text-indigo-300 text-[9px] uppercase font-semibold">Gökyüzü Haritası</span>
           </button>
        ) : (
           <div className="bg-slate-950/40 p-2 sm:p-2.5 rounded-xl flex flex-col items-center border border-slate-800/40">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">Dünya'ya Uzaklık</span>
              <span className="text-indigo-200 text-xs font-medium">{activeBody.id === 'sun' ? '149.597.870 km' : activeBody.distKm}</span>
           </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-800/50 pt-2">
        <button onClick={() => { setCompareTargetId(activeBody.id === 'earth' ? 'moon' : 'earth'); setModalView('compare'); }} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700 text-xs font-medium shadow-md">
          <Scale size={14}/> Kıyasla
        </button>
      </div>
    </div>
  );
}