import { useState, useEffect, RefObject } from 'react';

interface ScrollProgressOptions {
  clamp?: boolean;
}

export function useScrollProgress(
  containerRef: RefObject<HTMLElement>,
  options: ScrollProgressOptions = { clamp: true }
): { progress: number; rawProgress: number; isVisible: boolean } {
  const [progress, setProgress] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let ticking = false;

    const calculateProgress = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Track is visible if bottom > 0 and top < viewportHeight
      const inView = rect.bottom > 0 && rect.top < viewportHeight;
      setIsVisible(inView);

      // Total scrollable distance within this container
      // When rect.top is 0, progress is 0.
      // When rect.bottom is viewportHeight, progress is 1.
      const scrollableDistance = rect.height - viewportHeight;
      
      let p = 0;
      if (scrollableDistance > 0) {
        // -rect.top is how much has scrolled past the top of the viewport
        p = -rect.top / scrollableDistance;
      }

      setRawProgress(p);

      let clamped = p;
      if (options.clamp ?? true) {
        clamped = Math.max(0, Math.min(1, p));
      }

      setProgress(clamped);
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    // Initial calculation
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [containerRef, options.clamp]);

  return { progress, rawProgress, isVisible };
}
