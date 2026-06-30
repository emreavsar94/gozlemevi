//src/components/view/OrbitSystem.jsx

import React, { useContext } from 'react';
import { SimulationContext } from '../../context/SimulationContext';
import { ASTEROIDS } from '../../constants/astronomyData';
import PlanetTexture from './PlanetTexture';

const StaticBackground = React.memo(({ planets }) => (
  <g id="static-layer">
    <g id="asteroid-belt" className="pointer-events-none" style={{ transformOrigin: '-18px 0px', animation: 'spin 300s linear infinite' }}>
      <ellipse cx={-18} cy="0" rx="240" ry={240 * Math.sqrt(1 - 0.075 * 0.075)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="40" />
      {ASTEROIDS.map((a, i) => <circle key={`a${i}`} cx={a.cx} cy={a.cy} r={a.r} fill="rgba(209,213,219)" opacity={a.op} />)}
    </g>
    
    {planets.map(p => (
      <g key={`trail-${p.id}`}>
        <defs>
          <linearGradient id={`trailGrad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <ellipse 
          cx={p.uiCx} cy={p.uiCy} rx={p.a} ry={p.b} 
          fill="none" 
          stroke={p.id === 'earth' ? "rgba(255,255,255,0.2)" : `url(#trailGrad-${p.id})`} 
          strokeWidth="1.2" 
          strokeDasharray={p.id === 'earth' ? "4 4" : "none"} 
        />
      </g>
    ))}
  </g>
));

export default function OrbitSystem() {
  const { camera, winSize, planets, earth, moonMapCoords, setSelectedBodyId, setModalView } = useContext(SimulationContext);

  const handleBodyClick = (id) => {
    setSelectedBodyId(id);
    setModalView('detail');
  };

  if (!earth) return null;

  const viewW = winSize.w / camera.zoom;
  const viewH = winSize.h / camera.zoom;
  const viewX = camera.x - viewW / 2;
  const viewY = camera.y - viewH / 2;

  return (
    <svg viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`} className="w-full h-full absolute inset-0 text-white select-none overflow-hidden">
      <StaticBackground planets={planets} />

      {/* GÜNEŞ */}
      <g className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); handleBodyClick('sun'); }}>
        <circle cx="0" cy="0" r="45" fill="transparent" />
        <g transform="translate(-28, -28) scale(0.28)"><PlanetTexture id="sun" /></g>
        <circle cx="0" cy="0" r="28" fill="transparent" className="filter drop-shadow-[0_0_35px_rgba(251,191,36,0.7)] transition-all duration-300 group-hover:drop-shadow-[0_0_55px_rgba(251,191,36,0.9)]" />
        <text x="36" y="4" className="transition-colors drop-shadow-md">
           <tspan fill="rgba(255,255,255,0.8)" fontSize="13" fontWeight="500" className="group-hover:fill-white">Güneş</tspan>
        </text>
      </g>

      {/* GEZEGENLER */}
      {planets.map(p => (
        <g key={`body-${p.id}`} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); handleBodyClick(p.id); }}>
          <circle cx={p.uiX} cy={p.uiY} r={Math.max(20, p.size + 10)} fill="transparent" />
          <g transform={`translate(${p.uiX - p.size}, ${p.uiY - p.size}) scale(${p.size / 100})`}>
              <defs><radialGradient id={`glow-${p.id}`} cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor={p.glow}/><stop offset="60%" stopColor={p.color}/><stop offset="100%" stopColor="#1e293b"/></radialGradient></defs>
              <PlanetTexture id={p.id} color={p.color} glow={p.glow} sunAngle={p.sunAngle} />
          </g>
          <text x={p.uiX + p.size + 8} y={p.uiY + 4} className="transition-colors drop-shadow-md">
             <tspan fill="rgba(255,255,255,0.8)" fontSize="13" fontWeight="500" className="group-hover:fill-white">{p.name}</tspan>
          </text>
        </g>
      ))}

      {/* DÜNYA VE AY */}
      <g className="pointer-events-none">
        <circle cx={earth.uiX} cy={earth.uiY} r="26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="1 2" />
      </g>
      <g className="cursor-pointer group pointer-events-auto" onClick={(e) => { e.stopPropagation(); handleBodyClick('moon'); }}>
        <circle cx={moonMapCoords.x} cy={moonMapCoords.y} r="15" fill="transparent" />
        <g transform={`translate(${moonMapCoords.x - 3}, ${moonMapCoords.y - 3}) scale(0.03)`}>
           <PlanetTexture id="moon" sunAngle={earth.sunAngle} />
        </g>
        <text x={moonMapCoords.x + 8} y={moonMapCoords.y + 4} className="transition-colors drop-shadow-md pointer-events-none">
           <tspan fill="rgba(255,255,255,0.8)" fontSize="13" fontWeight="500" className="group-hover:fill-white">Ay</tspan>
        </text>
      </g>
    </svg>
  );
}