//src/components/layout/BackgroundStars.jsx

import React, { useMemo, useContext } from 'react';
import { SimulationContext } from '../../context/SimulationContext';

export default function BackgroundStars() {
  const { camera } = useContext(SimulationContext);

  const LAYER_1 = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({ id: `l1-${i}`, top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 1.5 + 1.5 })), []);
  const LAYER_2 = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({ id: `l2-${i}`, top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 1 + 0.8 })), []);
  const LAYER_3 = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({ id: `l3-${i}`, top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 5, duration: Math.random() * 10 + 10 })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-black" style={{ animation: 'nebula 60s infinite alternate ease-in-out' }} />
      
      {/* KATMAN 1: Uzak Derin Uzay (En Yavaş) */}
      <div className="absolute inset-[-20%] will-change-transform" style={{ transform: `translate3d(${camera.x * 0.05}px, ${camera.y * 0.05}px, 0)` }}>
        {LAYER_1.map(s => <div key={s.id} className="absolute rounded-full bg-slate-500 opacity-40" style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px` }} />)}
      </div>

      {/* KATMAN 2: Orta Yıldızlar (Twinkling) */}
      <div className="absolute inset-[-20%] will-change-transform" style={{ transform: `translate3d(${camera.x * 0.12}px, ${camera.y * 0.12}px, 0)` }}>
        {LAYER_2.map(s => <div key={s.id} className="absolute rounded-full bg-slate-300 opacity-70" style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px`, animation: `twinkle 4s infinite ease-in-out ${Math.random()*5}s` }} />)}
      </div>

      {/* KATMAN 3: Yakın Yıldızlar (Hızlı Drift) */}
      <div className="absolute inset-[-20%] will-change-transform" style={{ transform: `translate3d(${camera.x * 0.25}px, ${camera.y * 0.25}px, 0)` }}>
        {LAYER_3.map(s => <div key={s.id} className="absolute rounded-full bg-white blur-[0.5px]" style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px`, animation: `drift ${s.duration}s infinite linear ${s.delay}s` }} />)}
      </div>
    </div>
  );
}