//src/constants/astronomyData.js

export const MS_PER_DAY = 86400000;
export const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
export const KNOWN_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
export const LUNAR_MONTH = 29.53058867;

export const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export const YEARS = Array.from({ length: 201 }, (_, i) => 1900 + i);

export const LOCATIONS = [
  { id: 'istanbul', name: 'İstanbul', lat: 41.00, lon: 28.97 },
  { id: 'london', name: 'Londra', lat: 51.50, lon: -0.12 },
  { id: 'paris', name: 'Paris', lat: 48.85, lon: 2.35 },
  { id: 'newyork', name: 'New York', lat: 40.71, lon: -74.00 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.67, lon: 139.65 },
  { id: 'beijing', name: 'Pekin', lat: 39.90, lon: 116.40 },
  { id: 'cairo', name: 'Kahire', lat: 30.04, lon: 31.23 },
  { id: 'sydney', name: 'Sidney', lat: -33.86, lon: 151.20 }
];

export const PLANETS_DATA = [
  { id: 'mercury', name: 'Merkür', period: 87.97, distance: 0.387, baseAngle: 252, color: '#a8a29e', glow: '#d6d3d1', uiRadius: 74, size: 3.5, baseMag: -0.42, e: 0.205, radiusKm: 2439, gravity: 3.7, temp: '167°C', dayLength: '58.6 Gün' },
  { id: 'venus', name: 'Venüs', period: 224.70, distance: 0.723, baseAngle: 181, color: '#facc15', glow: '#fef08a', uiRadius: 106, size: 6, baseMag: -4.40, e: 0.006, radiusKm: 6051, gravity: 8.87, temp: '464°C', dayLength: '243 Gün' },
  { id: 'earth', name: 'Dünya', period: 365.25, distance: 1.000, baseAngle: 100, color: '#3b82f6', glow: '#93c5fd', uiRadius: 130, size: 6.5, baseMag: -3.86, e: 0.016, radiusKm: 6371, gravity: 9.81, temp: '15°C', dayLength: '24 Saat' },
  { id: 'mars', name: 'Mars', period: 686.98, distance: 1.524, baseAngle: 355, color: '#ef4444', glow: '#fca5a5', uiRadius: 166, size: 4.5, baseMag: -1.52, e: 0.093, radiusKm: 3389, gravity: 3.71, temp: '-65°C', dayLength: '24.6 Saat' },
  { id: 'ceres', name: 'Ceres', period: 1681.63, distance: 2.767, baseAngle: 60, color: '#9ca3af', glow: '#e5e7eb', uiRadius: 240, size: 3, baseMag: 3.34, e: 0.075, radiusKm: 473, gravity: 0.28, temp: '-105°C', dayLength: '9 Saat' },
  { id: 'jupiter', name: 'Jüpiter', period: 4332.59, distance: 5.203, baseAngle: 34, color: '#f97316', glow: '#fdba74', uiRadius: 350, size: 16, baseMag: -2.70, e: 0.048, radiusKm: 69911, gravity: 24.79, temp: '-110°C', dayLength: '9.9 Saat' },
  { id: 'saturn', name: 'Satürn', period: 10759.22, distance: 9.537, baseAngle: 50, color: '#fcd34d', glow: '#fde68a', uiRadius: 500, size: 14, baseMag: 0.69, e: 0.054, radiusKm: 58232, gravity: 10.44, temp: '-140°C', dayLength: '10.7 Saat' },
  { id: 'uranus', name: 'Uranüs', period: 30688.5, distance: 19.19, baseAngle: 314, color: '#2dd4bf', glow: '#5eead4', uiRadius: 770, size: 9, baseMag: 5.48, e: 0.047, radiusKm: 25362, gravity: 8.69, temp: '-195°C', dayLength: '17.2 Saat' },
  { id: 'neptune', name: 'Neptün', period: 60182.0, distance: 30.07, baseAngle: 304, color: '#2563eb', glow: '#60a5fa', uiRadius: 990, size: 8.5, baseMag: 7.83, e: 0.008, radiusKm: 24622, gravity: 11.15, temp: '-200°C', dayLength: '16.1 Saat' }
];

export const ALL_BODIES = [
  ...PLANETS_DATA,
  { id: 'moon', name: 'Ay', color: '#f1f5f9', radiusKm: 1737, gravity: 1.62, temp: '-20°C', dayLength: '29.5 Gün' },
  { id: 'sun', name: 'Güneş', color: '#fbbf24', radiusKm: 696340, gravity: 274, temp: '5500°C', dayLength: '27 Gün' }
];

export const ASTEROIDS = Array.from({ length: 500 }).map(() => {
  const angle = Math.random() * Math.PI * 2;
  const spread = Math.random() * 30 - 15;
  const a = 240 + spread;
  const e = 0.075;
  const c = 240 * e;
  const b = 240 * Math.sqrt(1 - e * e) + spread;
  return { cx: -c + a * Math.cos(angle), cy: b * Math.sin(angle), r: Math.random() * 1.5 + 0.5, op: Math.random() * 0.4 + 0.2 };
});