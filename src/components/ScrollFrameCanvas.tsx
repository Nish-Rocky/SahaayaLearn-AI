import React, { useRef, useEffect, useCallback } from 'react';

interface ScrollFrameCanvasProps {
  currentFrameIndex: number;
  getFrame: (index: number) => HTMLImageElement | null;
  prefetchRange: (index: number, radius?: number) => void;
  isVisible: boolean;
  prefersReducedMotion?: boolean;
}

export const ScrollFrameCanvas: React.FC<ScrollFrameCanvasProps> = ({
  currentFrameIndex,
  getFrame,
  prefetchRange,
  isVisible,
  prefersReducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameIndexRef = useRef<number>(-1);

  // High-performance canvas paint
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Pick frame index: if reduced motion, show frame 200 (crystal core)
    const effectiveIndex = prefersReducedMotion ? 200 : currentFrameIndex;

    const img = getFrame(effectiveIndex);
    if (!img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    // Calculate "cover" scale with center-weighted bias towards the right on desktop,
    // and centered on mobile portrait
    const scale = Math.max(cW / iW, cH / iH);
    const scaledW = iW * scale;
    const scaledH = iH * scale;

    // Subtle horizontal bias to preserve the core on wide vs mobile screens
    const isPortrait = displayHeight > displayWidth;
    // On landscape desktop, the crystal core is center-right (~55% from left).
    // On mobile portrait, center horizontally.
    const xOffset = isPortrait ? (cW - scaledW) * 0.5 : (cW - scaledW) * 0.55;
    const yOffset = (cH - scaledH) * 0.5;

    ctx.fillStyle = '#07111F';
    ctx.fillRect(0, 0, cW, cH);

    ctx.drawImage(img, xOffset, yOffset, scaledW, scaledH);
    lastDrawnFrameIndexRef.current = effectiveIndex;
  }, [currentFrameIndex, getFrame, prefersReducedMotion]);

  // Trigger prefetch around current target
  useEffect(() => {
    if (!prefersReducedMotion && isVisible) {
      prefetchRange(currentFrameIndex, 12);
    }
  }, [currentFrameIndex, isVisible, prefetchRange, prefersReducedMotion]);

  // Request Animation Frame paint scheduling
  useEffect(() => {
    if (!isVisible) return;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      renderCanvas();
    });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [currentFrameIndex, isVisible, renderCanvas]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      renderCanvas();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-brand-midnight select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block will-change-transform"
        aria-label="SahaayaLearn 3D neural voice animation"
        role="img"
      />
      {/* Cinematic subtle vignette and gradient integration */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 60% 50%, rgba(7, 17, 31, 0) 30%, rgba(7, 17, 31, 0.4) 70%, rgba(7, 17, 31, 0.85) 100%)'
        }}
      />
      {/* Left-edge smooth fade into text column on desktop */}
      <div 
        className="hidden lg:block absolute inset-y-0 left-0 w-1/3 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #07111F 10%, rgba(7, 17, 31, 0.6) 50%, transparent 100%)'
        }}
      />
      {/* Bottom edge fade into next section */}
      <div 
        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #07111F 0%, rgba(7, 17, 31, 0.6) 50%, transparent 100%)'
        }}
      />
    </div>
  );
};
