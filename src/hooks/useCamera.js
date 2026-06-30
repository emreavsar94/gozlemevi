//src/hooks/useCamera.js

import { useRef } from 'react';

export function useCamera(camera, setCamera) {
  const dragRef = useRef({ isDragging: false, lastX: 0, lastY: 0 });
  const pinchRef = useRef({ isPinching: false, distance: 0, initialZoom: 1 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.no-drag')) return;
    dragRef.current = { isDragging: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current = { ...dragRef.current, lastX: e.clientX, lastY: e.clientY };
    setCamera(c => ({ ...c, x: c.x - dx / c.zoom, y: c.y - dy / c.zoom }));
  };

  const handleMouseUp = () => { dragRef.current.isDragging = false; };

  const handleWheel = (e) => {
    if (e.target.closest('.no-drag')) return;
    setCamera(c => ({ ...c, zoom: Math.max(0.1, Math.min(3, c.zoom - e.deltaY * 0.001)) }));
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.no-drag')) return;
    if (e.touches.length === 2) {
      pinchRef.current.isPinching = true;
      pinchRef.current.distance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinchRef.current.initialZoom = camera.zoom;
      dragRef.current.isDragging = false;
    } else if (e.touches.length === 1) {
      dragRef.current = { isDragging: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (e.target.closest('.no-drag')) return;
    if (pinchRef.current.isPinching && e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const scale = dist / pinchRef.current.distance;
      setCamera(c => ({ ...c, zoom: Math.max(0.1, Math.min(3, pinchRef.current.initialZoom * scale)) }));
    } else if (dragRef.current.isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragRef.current.lastX;
      const dy = e.touches[0].clientY - dragRef.current.lastY;
      dragRef.current = { ...dragRef.current, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
      setCamera(c => ({ ...c, x: c.x - dx / c.zoom, y: c.y - dy / c.zoom }));
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) pinchRef.current.isPinching = false;
    if (e.touches.length === 0) dragRef.current.isDragging = false;
  };

  return { 
    onMouseDown: handleMouseDown, 
    onMouseMove: handleMouseMove, 
    onMouseUp: handleMouseUp, 
    onWheel: handleWheel, 
    onTouchStart: handleTouchStart, 
    onTouchMove: handleTouchMove, 
    onTouchEnd: handleTouchEnd 
  };
}