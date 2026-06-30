//src/hooks/useTimeLoop.js

import { useEffect } from 'react';
import { MS_PER_DAY } from '../constants/astronomyData';

export function useTimeLoop(isPlaying, setIsCalendarOpen, setCurrentDate) {
  useEffect(() => {
    if (isPlaying) setIsCalendarOpen(false);
    let animationFrameId;
    let lastTime = performance.now();
    const playSpeed = 1.5;

    const renderLoop = (time) => {
      if (time - lastTime > 40) {
        setCurrentDate(prev => new Date(prev.getTime() + MS_PER_DAY * playSpeed));
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, setIsCalendarOpen, setCurrentDate]);
}