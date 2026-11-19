import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 359;

export function getFrameUrl(index: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index));
  const numStr = String(clamped).padStart(6, '0');
  return `/frames/frame_${numStr}.jpg`;
}

interface FrameSequenceOptions {
  autoBackgroundLoad?: boolean;
  concurrency?: number;
}

export function useFrameSequence(options: FrameSequenceOptions = {}) {
  const { autoBackgroundLoad = true, concurrency = 4 } = options;

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isPosterLoaded, setIsPosterLoaded] = useState<boolean>(false);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);

  // Store loaded Image elements indexed 1 to TOTAL_FRAMES
  const framesCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingSetRef = useRef<Set<number>>(new Set());
  const queueRef = useRef<number[]>([]);
  const activeWorkersRef = useRef<number>(0);

  // Load a single frame by index
  const loadSingleFrame = useCallback((index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (framesCacheRef.current.has(index)) {
        resolve(framesCacheRef.current.get(index)!);
        return;
      }

      if (loadingSetRef.current.has(index)) {
        // Already loading, wait or resolve once loaded
        const checkInterval = setInterval(() => {
          if (framesCacheRef.current.has(index)) {
            clearInterval(checkInterval);
            resolve(framesCacheRef.current.get(index)!);
          }
        }, 50);
        return;
      }

      loadingSetRef.current.add(index);
      const img = new Image();
      img.src = getFrameUrl(index);

      // Decoding hint
      if ('decoding' in img) {
        img.decoding = 'async';
      }

      img.onload = () => {
        framesCacheRef.current.set(index, img);
        loadingSetRef.current.delete(index);
        setLoadedCount(framesCacheRef.current.size);
        if (index === 1) {
          setIsPosterLoaded(true);
        }
        resolve(img);
      };

      img.onerror = (err) => {
        loadingSetRef.current.delete(index);
        console.warn(`[FrameSequence] Failed to load frame ${index}:`, err);
        reject(err);
      };
    });
  }, []);

  // Worker loop for queue processing
  const processQueue = useCallback(() => {
    while (activeWorkersRef.current < concurrency && queueRef.current.length > 0) {
      const nextIndex = queueRef.current.shift();
      if (nextIndex === undefined) break;

      if (framesCacheRef.current.has(nextIndex) || loadingSetRef.current.has(nextIndex)) {
        continue;
      }

      activeWorkersRef.current += 1;
      loadSingleFrame(nextIndex)
        .catch(() => {})
        .finally(() => {
          activeWorkersRef.current -= 1;
          processQueue();
        });
    }
  }, [concurrency, loadSingleFrame]);

  // Request high-priority prefetch of frames around a center index
  const prefetchRange = useCallback((centerIndex: number, radius = 12) => {
    const toEnqueue: number[] = [];
    const min = Math.max(1, centerIndex - radius);
    const max = Math.min(TOTAL_FRAMES, centerIndex + radius);

    // Expand outward from center
    for (let r = 0; r <= radius; r++) {
      const forward = centerIndex + r;
      const backward = centerIndex - r;
      if (forward <= max && !framesCacheRef.current.has(forward) && !loadingSetRef.current.has(forward)) {
        toEnqueue.push(forward);
      }
      if (backward >= min && backward !== forward && !framesCacheRef.current.has(backward) && !loadingSetRef.current.has(backward)) {
        toEnqueue.push(backward);
      }
    }

    if (toEnqueue.length > 0) {
      // Prepend to queue for high priority
      queueRef.current = [...toEnqueue, ...queueRef.current.filter((idx) => !toEnqueue.includes(idx))];
      processQueue();
    }
  }, [processQueue]);

  // Retrieve best available frame (exact index or closest loaded neighbor)
  const getFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(targetIndex)));
    const cache = framesCacheRef.current;

    if (cache.has(clamped)) {
      return cache.get(clamped)!;
    }

    // Find nearest neighbor in both directions
    for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
      const before = clamped - delta;
      const after = clamped + delta;

      if (before >= 1 && cache.has(before)) {
        return cache.get(before)!;
      }
      if (after <= TOTAL_FRAMES && cache.has(after)) {
        return cache.get(after)!;
      }
    }

    return null;
  }, []);

  // Initial prioritized loading on mount
  useEffect(() => {
    let isCancelled = false;

    async function initializeFrames() {
      // 1. Immediately load frame 1 (poster frame)
      try {
        await loadSingleFrame(1);
      } catch (e) {
        console.error('Failed to load initial poster frame', e);
      }

      if (isCancelled) return;

      // 2. Load key milestone anchor frames evenly spaced across 0-100%
      // 1, 15, 30, 45, 60, 75, ... 359
      const anchors: number[] = [];
      const step = 15;
      for (let i = 1; i <= TOTAL_FRAMES; i += step) {
        if (i !== 1) anchors.push(i);
      }
      if (!anchors.includes(TOTAL_FRAMES)) {
        anchors.push(TOTAL_FRAMES);
      }

      // Load first 5 anchors immediately
      const firstBatch = anchors.slice(0, 6);
      await Promise.allSettled(firstBatch.map((idx) => loadSingleFrame(idx)));
      setIsInitialReady(true);

      if (isCancelled) return;

      // 3. Queue the remaining anchor frames
      const remainingAnchors = anchors.slice(6);
      queueRef.current.push(...remainingAnchors);

      // 4. If auto background load is enabled, queue all remaining frames
      if (autoBackgroundLoad) {
        const remainingAll: number[] = [];
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          if (!anchors.includes(i)) {
            remainingAll.push(i);
          }
        }
        queueRef.current.push(...remainingAll);
      }

      processQueue();
    }

    initializeFrames();

    return () => {
      isCancelled = true;
    };
  }, [autoBackgroundLoad, loadSingleFrame, processQueue]);

  return {
    totalFrames: TOTAL_FRAMES,
    loadedCount,
    loadProgress: loadedCount / TOTAL_FRAMES,
    isPosterLoaded,
    isInitialReady,
    getFrame,
    prefetchRange,
  };
}
