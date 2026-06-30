//src/context/SimulationContext.jsx

import React, { createContext, useState, useMemo, useEffect } from 'react';
import { LOCATIONS, ALL_BODIES } from '../constants/astronomyData';
import { calculatePlanetPositions, calculateMoonPhase, calculatePlanetPhaseFromEarth } from '../utils/astronomyMath';

export const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [winSize, setWinSize] = useState({ w: 1200, h: 800 });
  const [isClient, setIsClient] = useState(false);
  const [selectedBodyId, setSelectedBodyId] = useState(null);
  const [modalView, setModalView] = useState('detail');
  const [compareTargetId, setCompareTargetId] = useState('earth');
  const [userWeight, setUserWeight] = useState(70);
  const [skyLocation, setSkyLocation] = useState(LOCATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const [camera, setCamera] = useState({
    x: 0,
    y: 60,
    zoom: isMobile ? 1.8 : 0.9 
  });

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const planets = useMemo(() => calculatePlanetPositions(currentDate), [currentDate]);
  const moonData = useMemo(() => calculateMoonPhase(currentDate), [currentDate]);
  const earth = useMemo(() => planets.find(p => p.id === 'earth'), [planets]);

  const moonMapCoords = useMemo(() => {
    if (!earth) return { x: 0, y: 0 };
    const earthToSunAngle = Math.atan2(-earth.uiY, -earth.uiX);
    const moonAngle = earthToSunAngle - (moonData.phase * 2 * Math.PI);
    return { x: earth.uiX + 26 * Math.cos(moonAngle), y: earth.uiY + 26 * Math.sin(moonAngle) };
  }, [earth, moonData.phase]);

  const activeBody = useMemo(() => {
    if (!selectedBodyId) return null;
    if (selectedBodyId === 'moon') return { id: 'moon', name: 'Ay', phaseName: moonData.phaseName, color: '#f1f5f9', glow: '#cbd5e1', phase: moonData.phase, illumination: moonData.illumination, magnitude: '-12.7', distKm: '384.400 km', radiusKm: 1737, gravity: 1.62, temp: '-20°C', periodText: `${moonData.age.toFixed(1)} Gün`, dayLength: '29.5 Gün' };
    if (selectedBodyId === 'sun') return { id: 'sun', name: 'Güneş', phaseName: 'Yıldızımız', color: '#fbbf24', glow: '#fef08a', phase: 0.5, illumination: 1, magnitude: '-26.7', distKm: '149.597.870 km', radiusKm: 696340, gravity: 274, temp: '5500°C', periodText: 'N/A', dayLength: '27 Gün' };
    if (selectedBodyId === 'earth') return { id: 'earth', name: 'Dünya', phaseName: 'Gözlem Noktası', color: '#3b82f6', glow: '#93c5fd', phase: 0.5, illumination: 1, magnitude: 'N/A', distKm: '0 km', radiusKm: 6371, gravity: 9.81, temp: '15°C', periodText: '365.25 Gün', dayLength: '24 Saat' };

    const p = planets.find(x => x.id === selectedBodyId);
    if (!p) return null;
    const phaseInfo = calculatePlanetPhaseFromEarth(p, earth);
    return { ...p, ...phaseInfo, periodText: `${p.period} Gün` };
  }, [selectedBodyId, planets, earth, moonData]);

  const compTargetBody = useMemo(() => ALL_BODIES.find(b => b.id === compareTargetId), [compareTargetId]);

  const value = {
    currentDate, setCurrentDate,
    winSize, isClient,
    selectedBodyId, setSelectedBodyId,
    modalView, setModalView,
    compareTargetId, setCompareTargetId,
    userWeight, setUserWeight,
    skyLocation, setSkyLocation,
    isPlaying, setIsPlaying,
    isCalendarOpen, setIsCalendarOpen,
    camera, setCamera,
    planets, moonData, earth, moonMapCoords, activeBody, compTargetBody
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}