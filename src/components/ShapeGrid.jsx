import { useEffect, useRef } from 'react';
import './ShapeGrid.css';

const ShapeGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const gridSize = 60;
    const shapes = [];

    const buildShapes = () => {
      shapes.length = 0;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      for (let x = gridSize / 2; x < w; x += gridSize) {
        for (let y = gridSize / 2; y < h; y += gridSize) {
          shapes.push({
            x,
            y,
            size: 20,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            type: Math.floor(Math.random() * 3),
          });
        }
      }
    };

    buildShapes();
    window.addEventListener('resize', buildShapes, { passive: true });

    let animationFrameId;
    let running = !document.hidden;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(135, 206, 250, 0.15)';
      ctx.lineWidth = 1;

      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);

        ctx.strokeStyle = 'rgba(135, 206, 250, 0.3)';
        ctx.lineWidth = 2;

        if (shape.type === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shape.type === 1) {
          ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.restore();

        if (!prefersReducedMotion) {
          shape.rotation += shape.rotationSpeed;
        }
      }

      if (running) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationFrameId);
      } else if (!running) {
        running = true;
        draw();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    draw();

    return () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', buildShapes);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="shape-grid" aria-hidden="true" />;
};

export default ShapeGrid;
