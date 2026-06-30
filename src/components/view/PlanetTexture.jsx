//src/components/view/PlanetTexture.jsx

import React from 'react';

const PlanetTexture = React.memo(({ id, color, glow, sunAngle = 0, hideShadow = false }) => {
  
  const renderShadow = () => {
    if (hideShadow || id === 'sun' || id === 'earth') return null;
    return (
      <path 
        d="M 100 0 A 100 100 0 0 1 100 200 A 10 100 0 0 0 100 0 Z" 
        fill="#020617" 
        opacity="0.45" 
        className="mix-blend-multiply"
        transform={`rotate(${sunAngle} 100 100)`}
      />
    );
  };

  switch (id) {
    case 'sun':
      return (
        <g>
          <path d="M 100 10 Q 140 -20 160 30 Q 130 0 100 10 Z" fill="#ea580c" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" values="0 100 100; 360 100 100" dur="20s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3; 0.7; 0.3" dur="4s" repeatCount="indefinite"/>
          </path>
          <path d="M 10 90 Q -30 110 20 160 Q 0 120 10 90 Z" fill="#f59e0b" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" values="360 100 100; 0 100 100" dur="30s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.2; 0.8; 0.2" dur="5s" repeatCount="indefinite"/>
          </path>

          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#fffbeb"/><stop offset="40%" stopColor="#fde047"/><stop offset="80%" stopColor="#ea580c"/><stop offset="100%" stopColor="#9a3412"/>
          </radialGradient>
          <circle cx="100" cy="100" r="100" fill="url(#sunGrad)" />
          <circle cx="100" cy="100" r="100" fill="none" stroke="#f59e0b" strokeWidth="5" opacity="0.5">
            <animate attributeName="r" values="100;104;100" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
      );
    case 'saturn':
      return (
        <g>
          <defs>
            <linearGradient id="satGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" opacity="0.2"/><stop offset="50%" stopColor="#fef3c7" opacity="0.4"/><stop offset="100%" stopColor="#b45309" opacity="0.2"/>
            </linearGradient>
            <clipPath id="saturn-back-clip">
              <rect x="-200" y="-200" width="600" height="300" transform="rotate(-20 100 100)" />
            </clipPath>
            <clipPath id="saturn-front-clip">
              <rect x="-200" y="100" width="600" height="300" transform="rotate(-20 100 100)" />
            </clipPath>
          </defs>

          <g transform="rotate(-20 100 100)" clipPath="url(#saturn-back-clip)">
            <ellipse cx="100" cy="100" rx="180" ry="50" fill="none" stroke="rgba(210,180,140,0.6)" strokeWidth="18" />
            <ellipse cx="100" cy="100" rx="210" ry="60" fill="none" stroke="rgba(210,180,140,0.3)" strokeWidth="10" />
          </g>

          <circle cx="100" cy="100" r="100" fill="#fcd34d" />
          <circle cx="100" cy="100" r="100" fill="url(#satGrad)" />
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.2"/>
          {renderShadow()}

          <g transform="rotate(-20 100 100)" clipPath="url(#saturn-front-clip)">
            <ellipse cx="100" cy="100" rx="180" ry="50" fill="none" stroke="rgba(210,180,140,0.6)" strokeWidth="18" />
            <ellipse cx="100" cy="100" rx="210" ry="60" fill="none" stroke="rgba(210,180,140,0.3)" strokeWidth="10" />
          </g>
        </g>
      );
    case 'earth':
      return (
        <g>
          <circle cx="100" cy="100" r="100" fill="#1e40af" />
          <path d="M 40 40 Q 60 20 80 50 T 60 90 T 30 70 Z M 120 60 Q 150 40 170 80 T 140 140 T 100 110 Z M 60 140 Q 90 180 120 160 T 90 120 Z" fill="#16a34a" opacity="0.85"/>
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.3"/>
          {renderShadow()}
        </g>
      );
    case 'jupiter':
      return (
        <g>
          <linearGradient id="jupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9a3412"/><stop offset="15%" stopColor="#fcd34d"/><stop offset="30%" stopColor="#b45309"/>
            <stop offset="50%" stopColor="#fde68a"/><stop offset="70%" stopColor="#d97706"/><stop offset="85%" stopColor="#fcd34d"/><stop offset="100%" stopColor="#9a3412"/>
          </linearGradient>
          <circle cx="100" cy="100" r="100" fill="url(#jupGrad)" />
          <ellipse cx="130" cy="140" rx="25" ry="12" fill="#991b1b" opacity="0.7"/>
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.2"/>
          {renderShadow()}
        </g>
      );
    case 'mars':
      return (
        <g>
          <circle cx="100" cy="100" r="100" fill="#dc2626" />
          <path d="M 30 60 Q 80 40 120 70 T 160 130 T 90 160 T 40 110 Z" fill="#991b1b" opacity="0.6" />
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.3"/>
          {renderShadow()}
        </g>
      );
    case 'moon':
      return (
        <g>
          <circle cx="100" cy="100" r="100" fill="#e2e8f0" />
          <circle cx="60" cy="60" r="15" fill="#94a3b8" opacity="0.6" />
          <circle cx="140" cy="90" r="25" fill="#94a3b8" opacity="0.5" />
          <circle cx="80" cy="140" r="20" fill="#94a3b8" opacity="0.7" />
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.4"/>
          {renderShadow()}
        </g>
      );
    case 'ceres':
      return (
        <g>
          <circle cx="100" cy="100" r="100" fill="#9ca3af" />
          <circle cx="50" cy="70" r="18" fill="#6b7280" opacity="0.5" />
          <circle cx="140" cy="130" r="24" fill="#6b7280" opacity="0.4" />
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.4"/>
          {renderShadow()}
        </g>
      );
    case 'mercury':
      return (
        <g>
          <circle cx="100" cy="100" r="100" fill="#a8a29e" />
          <circle cx="40" cy="50" r="10" fill="#78716c" opacity="0.5" />
          <circle cx="130" cy="120" r="20" fill="#78716c" opacity="0.5" />
          <circle cx="90" cy="160" r="14" fill="#78716c" opacity="0.6" />
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.3"/>
          {renderShadow()}
        </g>
      );
    case 'venus':
      return (
        <g>
          <linearGradient id="venGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a"/><stop offset="30%" stopColor="#fde047"/><stop offset="70%" stopColor="#eab308"/><stop offset="100%" stopColor="#ca8a04"/>
          </linearGradient>
          <circle cx="100" cy="100" r="100" fill="url(#venGrad)" />
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.2"/>
          {renderShadow()}
        </g>
      );
    case 'uranus':
      return (
        <g>
          <circle cx="100" cy="100" r="100" fill="#2dd4bf" />
          <ellipse cx="100" cy="100" rx="140" ry="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" transform="rotate(80 100 100)" />
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.3"/>
          {renderShadow()}
        </g>
      );
    case 'neptune':
      return (
        <g>
          <linearGradient id="nepGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6"/><stop offset="50%" stopColor="#2563eb"/><stop offset="100%" stopColor="#1d4ed8"/>
          </linearGradient>
          <circle cx="100" cy="100" r="100" fill="url(#nepGrad)" />
          <path d="M 20 80 Q 100 100 180 80" fill="none" stroke="#1e3a8a" strokeWidth="8" opacity="0.4"/>
          <path d="M 30 130 Q 100 140 170 130" fill="none" stroke="#1e3a8a" strokeWidth="6" opacity="0.3"/>
          <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" opacity="0.2"/>
          {renderShadow()}
        </g>
      );
    default:
      return <circle cx="100" cy="100" r="100" fill="url(#bodyGlow)" />;
  }
});

export default PlanetTexture;