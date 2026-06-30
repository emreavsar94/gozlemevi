//src/utils/astronomyMath.js

import { J2000, MS_PER_DAY, KNOWN_NEW_MOON, LUNAR_MONTH, PLANETS_DATA } from '../constants/astronomyData';

export function calculatePlanetPositions(targetDate) {
  const daysSinceJ2000 = (targetDate.getTime() - J2000.getTime()) / MS_PER_DAY;
  
  return PLANETS_DATA.map(p => {
    const angleDeg = ((daysSinceJ2000 / p.period) * 360 + p.baseAngle) % 360;
    const angleRad = angleDeg * (Math.PI / 180);
    
    const a = p.uiRadius;
    const c = a * p.e; 
    const b = a * Math.sqrt(1 - p.e * p.e); 
    
    const uiX = -c + a * Math.cos(angleRad);
    const uiY = b * Math.sin(angleRad);
    
    const sunAngle = Math.atan2(uiY, uiX) * (180 / Math.PI);
    const distKm = p.distance * 149597870;
    const lightSeconds = distKm / 299792;

    return {
      ...p, angleRad, a, b, c, uiX, uiY, sunAngle,
      uiCx: -c, uiCy: 0,
      realX: p.distance * Math.cos(angleRad),
      realY: p.distance * Math.sin(angleRad),
      lightTravelTime: lightSeconds
    };
  });
}

export function calculateMoonPhase(targetDate) {
  const diff = targetDate.getTime() - KNOWN_NEW_MOON.getTime();
  const days = diff / MS_PER_DAY;
  
  const anomalyCorrection = 0.016 * Math.sin(((days / 27.55455) * 2 * Math.PI));
  
  let phase = (days / LUNAR_MONTH + anomalyCorrection) % 1; 
  if (phase < 0) phase += 1;
  
  const age = phase * LUNAR_MONTH;
  const illumination = 0.5 * (1 - Math.cos(phase * 2 * Math.PI));
  
  let phaseName = age < 1.84 ? "Yeni Ay" : age < 5.53 ? "Yeni Hilal" : age < 9.22 ? "İlk Dördün" : age < 12.91 ? "İlk Şişkin Ay" : age < 16.61 ? "Dolunay" : age < 20.3 ? "Son Şişkin Ay" : age < 23.99 ? "Son Dördün" : age < 27.68 ? "Son Hilal" : "Yeni Ay";
  return { phase, age, illumination, phaseName };
}

export function calculatePlanetPhaseFromEarth(planet, earth) {
  const vecPE_x = earth.realX - planet.realX; const vecPE_y = earth.realY - planet.realY;
  const vecPS_x = -planet.realX; const vecPS_y = -planet.realY;
  const magPE = Math.hypot(vecPE_x, vecPE_y); const magPS = Math.hypot(vecPS_x, vecPS_y);
  let cosAlpha = Math.max(-1, Math.min(1, (vecPE_x * vecPS_x + vecPE_y * vecPS_y) / (magPE * magPS)));
  const alpha = Math.acos(cosAlpha);
  let visualPhase = alpha / (2 * Math.PI);
  if ((vecPS_x * vecPE_y - vecPS_y * vecPE_x) < 0) visualPhase = 1 - visualPhase;

  const illumination = 0.5 * (1 + cosAlpha);
  const magnitude = (planet.baseMag + 5 * Math.log10(magPS * magPE)).toFixed(1);
  const distKm = (magPE * 149597870).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' km';

  let phaseName = "Evre";
  if (illumination < 0.05) phaseName = "Yeni Evre"; else if (illumination < 0.45) phaseName = "Hilal Evresi"; else if (illumination < 0.55) phaseName = "Yarım Evre"; else if (illumination < 0.95) phaseName = "Şişkin Evre"; else phaseName = "Tam (Dolunay)";

  return { phase: visualPhase, illumination, magnitude, distKm, phaseName };
}

export function calculateSkyVisibility(planets, earth, date, lon) {
  const visiblePlanets = [];
  const earthLon = Math.atan2(earth.realY, earth.realX);
  const sunLonFromEarth = earthLon + Math.PI;
  const localHour = date.getUTCHours() + date.getUTCMinutes() / 60 + (lon / 15);
  const observerAngle = sunLonFromEarth + ((localHour - 12) / 24) * Math.PI * 2;

  planets.forEach(p => {
    if (p.id === 'earth') return;
    const planetLonFromEarth = Math.atan2(p.realY - earth.realY, p.realX - earth.realX);
    let angleDiff = (planetLonFromEarth - observerAngle) % (Math.PI * 2);
    if (angleDiff <= -Math.PI) angleDiff += Math.PI * 2;
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    visiblePlanets.push({ ...p, isVisible: Math.abs(angleDiff) < (Math.PI / 2), azimuthApprox: angleDiff });
  });
  return visiblePlanets;
}

export function getBodySVGShadowPath(phase) {
  if (phase === undefined) return "";
  let p = phase % 1; if (p < 0) p += 1;

  if (p < 0.005 || p > 0.995) return "M 100,0 A 100,100 0 1,0 100,200 A 100,100 0 1,0 100,0 Z"; // Yeni Ay
  if (Math.abs(p - 0.5) < 0.005) return ""; // Dolunay

  if (p < 0.25) { // Yeni Hilal -> İlk Dördün (Sağ kenar aydınlanır, sol taraf karanlık kalır)
    const r = 100 * (1 - 4 * p);
    return `M 100,0 A 100,100 0 0,0 100,200 A ${r},100 0 0,0 100,0 Z`;
  } else if (p < 0.5) { // İlk Dördün -> Dolunay (Aydınlık sağdan sola büyür, sol kenarda ince gölge kalır)
    const r = 100 * (4 * p - 1);
    return `M 100,0 A 100,100 0 0,0 100,200 A ${r},100 0 0,1 100,0 Z`;
  } else if (p < 0.75) { // Dolunay -> Son Dördün (Sağ kenar kararmaya başlar, sol taraf aydınlık kalır)
    const r = 100 * (3 - 4 * p);
    return `M 100,0 A 100,100 0 0,1 100,200 A ${r},100 0 0,0 100,0 Z`;
  } else { // Son Dördün -> Yeni Ay (Sol kenarda ince bir hilal kalır, sağ taraf ve merkez karanlıktır)
    const r = 100 * (4 * p - 3);
    return `M 100,0 A 100,100 0 0,1 100,200 A ${r},100 0 0,1 100,0 Z`;
  }
}