//src/App.jsx

import React, { useContext } from 'react';
import { SimulationContext, SimulationProvider } from './context/SimulationContext';
import OrbitSystem from './components/view/OrbitSystem';
import ModalManager from './components/modals/ModalManager';
import BottomControls from './components/controls/BottomControls';
import BackgroundStars from './components/layout/BackgroundStars';
import { useCamera } from './hooks/useCamera';
import { useTimeLoop } from './hooks/useTimeLoop';

function MainSimulationApp() {
  const { isClient, camera, setCamera, isPlaying, setIsCalendarOpen, setCurrentDate, isCalendarOpen } = useContext(SimulationContext);
  
  useTimeLoop(isPlaying, setIsCalendarOpen, setCurrentDate);
  const cameraProps = useCamera(camera, setCamera);

  if (!isClient) return <div className="fixed inset-0 bg-slate-950" />;

  return (
    <div 
      className="fixed inset-0 bg-slate-950 text-white font-sans select-none overflow-hidden touch-none"
      {...cameraProps}
      onClick={() => isCalendarOpen && setIsCalendarOpen(false)}
    >
      <BackgroundStars />
      <OrbitSystem />
      <ModalManager />
      <BottomControls />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <MainSimulationApp />
    </SimulationProvider>
  );
}