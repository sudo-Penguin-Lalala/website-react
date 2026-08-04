import { useEffect, useRef } from 'react';
import './ShapeGrid.css';

const ShapeGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;

    const circles = [];
    const squares = [];
    const triangles = [];

    const gridSize = 80;

    const resizeAndBuild = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      width = w;
      height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      circles.length = 0;
      squares.length = 0;
      triangles.length = 0;

      // Seeded-like sparse placement: only place on ~35% of grid intersections
      let idx = 0;
      for (let x = gridSize / 2; x < w; x += gridSize) {
        for (let y = gridSize / 2; y < h; y += gridSize) {
          idx++;
          // Skip ~60% of intersections for a cleaner, modern, airy aesthetic
          if ((idx * 7 + 13) % 10 > 3) continue;

          const shapeType = idx % 3;
          const item = {
            x,
            y,
            size: 16,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.015,
          };

          if (shapeType === 0) circles.push(item);
          else if (shapeType === 1) squares.push(item);
          else triangles.push(item);
        }
      }
    };

    resizeAndBuild();
    window.addEventListener('resize', resizeAndBuild, { passive: true });

    let animationFrameId;
    let running = !document.hidden;
    let lastTime = performance.now();

    const draw = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // 1. Single batched path for all grid lines
      ctx.strokeStyle = 'rgba(135, 206, 250, 0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(135, 206, 250, 0.25)';
      ctx.lineWidth = 1.5;

      // 2. Batched circles (no matrix transforms needed)
      if (circles.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < circles.length; i++) {
          const c = circles[i];
          const radius = c.size / 2;
          ctx.moveTo(c.x + radius, c.y);
          ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
        }
        ctx.stroke();
      }

      // 3. Batched rotated squares (direct vertex math, zero save/restore)
      if (squares.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < squares.length; i++) {
          const s = squares[i];
          const half = s.size / 2;
          const cos = Math.cos(s.rotation);
          const sin = Math.sin(s.rotation);
          const dx1 = cos * half - sin * half;
          const dy1 = sin * half + cos * half;
          const dx2 = -cos * half - sin * half;
          const dy2 = -sin * half + cos * half;

          ctx.moveTo(s.x + dx1, s.y + dy1);
          ctx.lineTo(s.x + dx2, s.y + dy2);
          ctx.lineTo(s.x - dx1, s.y - dy1);
          ctx.lineTo(s.x - dx2, s.y - dy2);
          ctx.closePath();

          if (!prefersReducedMotion) {
            s.rotation += s.rotationSpeed * (dt * 60);
          }
        }
        ctx.stroke();
      }

      // 4. Batched rotated triangles (direct vertex math)
      if (triangles.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < triangles.length; i++) {
          const t = triangles[i];
          const r = t.size / 2;
          const rot = t.rotation;
          const x1 = t.x + r * Math.sin(rot);
          const y1 = t.y - r * Math.cos(rot);
          const x2 = t.x + r * Math.sin(rot + 2.0944);
          const y2 = t.y - r * Math.cos(rot + 2.0944);
          const x3 = t.x + r * Math.sin(rot + 4.1888);
          const y3 = t.y - r * Math.cos(rot + 4.1888);

          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();

          if (!prefersReducedMotion) {
            t.rotation += t.rotationSpeed * (dt * 60);
          }
        }
        ctx.stroke();
      }

      if (running && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationFrameId);
      } else if (!running) {
        running = true;
        lastTime = performance.now();
        draw(lastTime);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    draw(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeAndBuild);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="shape-grid" aria-hidden="true" />;
};

export default ShapeGrid;
