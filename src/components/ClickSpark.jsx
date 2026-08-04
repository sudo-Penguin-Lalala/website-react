import { useEffect, useRef } from 'react';
import './ClickSpark.css';

const ClickSpark = ({ children }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateSize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const colors = ['#60a5fa', '#a78bfa', '#38bdf8', '#c084fc', '#93c5fd'];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.life -= 0.035;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (sparks.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        animFrameIdRef.current = null;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const handleClick = (e) => {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const count = 8;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 1.5 + Math.random() * 2.5;
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
        });
      }

      if (!animFrameIdRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('click', handleClick);
    }

    return () => {
      resizeObserver.disconnect();
      if (containerEl) {
        containerEl.removeEventListener('click', handleClick);
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="click-spark-container">
      <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />
      {children}
    </div>
  );
};

export default ClickSpark;

