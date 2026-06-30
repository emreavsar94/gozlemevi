//src/components/modals/CompareModal.jsx

import React, { useContext } from 'react';
import { SimulationContext } from '../../context/SimulationContext';
import PlanetTexture from '../view/PlanetTexture';
import { ALL_BODIES } from '../../constants/astronomyData';

export default function CompareModal() {
  const { activeBody, compTargetBody, compareTargetId, setCompareTargetId, userWeight, winSize } = useContext(SimulationContext);
  const scaleFactor = (winSize.w < 768 ? 35 : 55) / Math.max(activeBody.radiusKm, compTargetBody.radiusKm);

  return (
    <div className="w-full flex flex-col items-center p-4 sm:p-5 pt-1 overflow-y-auto md:overflow-hidden h-full select-none custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5 w-full md:h-full">
        
        {/* AKTİF GEZEGEN PANELİ */}
        <div className="flex flex-col items-center justify-between min-h-[420px] md:h-full py-1">
          <h3 className="text-xs font-light text-white bg-slate-950 py-0.5 px-4 rounded-full border border-slate-800 shrink-0">{activeBody.name}</h3>
          
          <div className="flex-1 flex items-center justify-center my-4">
            <svg width={activeBody.radiusKm * scaleFactor * 2} height={activeBody.radiusKm * scaleFactor * 2} viewBox="0 0 200 200" className="overflow-visible">
               <PlanetTexture id={activeBody.id} color={activeBody.color} glow={activeBody.glow} hideShadow={true} />
            </svg>
          </div>
          
          <div className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center shadow-inner shrink-0 mb-2">
            <p className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">Buradaki Ağırlığınız</p>
            <p className="text-xl font-light text-white">{(userWeight * (activeBody.gravity / 9.81)).toFixed(1)} <span className="text-2xs text-slate-500">kg</span></p>
          </div>
          <div className="flex flex-col gap-0.5 w-full px-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50 shrink-0 text-[11px]">
            <p className="text-slate-400 flex justify-between"><span>Yarıçap:</span> <span className="text-slate-200">{activeBody.radiusKm.toLocaleString('tr-TR')} km</span></p>
            <p className="text-slate-400 flex justify-between"><span>Ort. Sıcaklık:</span> <span className="text-slate-200">{activeBody.temp}</span></p>
            <p className="text-slate-400 flex justify-between"><span>1 Gün Süresi:</span> <span className="text-slate-200">{activeBody.dayLength}</span></p>
          </div>
        </div>

        {/* KIYAS HEDEFİ PANELİ */}
        <div className="flex flex-col items-center justify-between min-h-[420px] md:h-full border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5 py-1">
          <select 
             value={compareTargetId} 
             onChange={e => setCompareTargetId(e.target.value)} 
             className="text-xs font-light bg-slate-800 border border-slate-600 text-white py-0.5 px-4 rounded-full focus:outline-none cursor-pointer text-center appearance-none w-full max-w-[130px] shadow-md relative z-10 shrink-0"
          >
            {ALL_BODIES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          
          <div className="flex-1 flex items-center justify-center my-4">
            <svg width={compTargetBody.radiusKm * scaleFactor * 2} height={compTargetBody.radiusKm * scaleFactor * 2} viewBox="0 0 200 200" className="overflow-visible">
               <PlanetTexture id={compTargetBody.id} color={compTargetBody.color} glow={compTargetBody.glow} hideShadow={true} />
            </svg>
          </div>
          
          <div className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center shadow-inner shrink-0 mb-2">
            <p className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">Buradaki Ağırlığınız</p>
            <p className="text-xl font-light text-white">{(userWeight * (compTargetBody.gravity / 9.81)).toFixed(1)} <span className="text-2xs text-slate-500">kg</span></p>
          </div>
          <div className="flex flex-col gap-0.5 w-full px-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50 shrink-0 text-[11px]">
            <p className="text-slate-400 flex justify-between"><span>Yarıçap:</span> <span className="text-slate-200">{compTargetBody.radiusKm.toLocaleString('tr-TR')} km</span></p>
            <p className="text-slate-400 flex justify-between"><span>Ort. Sıcaklık:</span> <span className="text-slate-200">{compTargetBody.temp}</span></p>
            <p className="text-slate-400 flex justify-between"><span>1 Gün Süresi:</span> <span className="text-slate-200">{compTargetBody.dayLength}</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}