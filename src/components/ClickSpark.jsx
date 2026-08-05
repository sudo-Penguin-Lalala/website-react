import { useEffect, useRef } from 'react';
import './ClickSpark.css';

const SPARK_COLORS = ['#60a5fa', '#38bdf8', '#a78bfa', '#c084fc', '#ffffff'];
const RAY_COUNT = 8; // Classic 8-point fixed '*' starburst
const DURATION = 380; // Animation duration in ms
const MAX_DISTANCE = 26; // Maximum spread distance in px
const SPARK_LENGTH = 10; // Spark line length in px
const LINE_WIDTH = 2; // Spark line stroke width in px

const ClickSpark = ({ children }) => {
  const canvasRef = useRef(null);
  const burstsRef = useRef([]);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = null;
    try {
      ctx = canvas.getContext('2d', { alpha: true });
    } catch {
      return;
    }
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const updateSize = () => {
      if (!canvas) return;
      // Use window viewport dimensions instead of full scroll container to avoid canvas size overflow on iOS
      const w = window.innerWidth || document.documentElement.clientWidth || 360;
      const h = window.innerHeight || document.documentElement.clientHeight || 640;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 to stay well within iOS GPU limits

      width = w;
      height = h;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    const render = (now) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const bursts = burstsRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        const elapsed = now - b.startTime;
        const progress = Math.min(1, elapsed / DURATION);

        if (progress >= 1) {
          bursts.splice(i, 1);
          continue;
        }

        // Ease-out cubic for a fast snappy burst that slows down gracefully
        const ease = 1 - Math.pow(1 - progress, 3);
        const dist = ease * MAX_DISTANCE;
        const currentLength = SPARK_LENGTH * (1 - progress);
        const alpha = Math.max(0, 1 - progress);

        ctx.save();
        ctx.strokeStyle = b.color;
        ctx.lineWidth = LINE_WIDTH;
        ctx.lineCap = 'round';
        ctx.globalAlpha = alpha;

        for (let r = 0; r < RAY_COUNT; r++) {
          const angle = (Math.PI * 2 * r) / RAY_COUNT;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          const x1 = b.x + cos * dist;
          const y1 = b.y + sin * dist;
          const x2 = b.x + cos * (dist + currentLength);
          const y2 = b.y + sin * (dist + currentLength);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        ctx.restore();
      }

      if (bursts.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        animFrameIdRef.current = null;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const handlePointerDown = (e) => {
      try {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
          return;
        }

        // Use viewport coordinates directly since canvas is fixed to viewport
        const x = e.clientX;
        const y = e.clientY;

        if (typeof x !== 'number' || typeof y !== 'number') return;

        burstsRef.current.push({
          x,
          y,
          startTime: performance.now(),
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        });

        if (!animFrameIdRef.current) {
          animFrameIdRef.current = requestAnimationFrame(render);
        }
      } catch {
        // Safe failover
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />
      {children}
    </>
  );
};

export default ClickSpark;
