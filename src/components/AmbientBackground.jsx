import { useEffect, useRef } from "react";
import "./AmbientBackground.css";

const AmbientBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isTouch) return;

    let rafId = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      container.style.setProperty("--mouse-x", `${currentX.toFixed(1)}px`);
      container.style.setProperty("--mouse-y", `${currentY.toFixed(1)}px`);

      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="ambient-bg" aria-hidden="true">
      <div className="ambient-bg__base" />
      <div className="ambient-bg__glow ambient-bg__glow--primary" />
      <div className="ambient-bg__glow ambient-bg__glow--cyan" />
      <div className="ambient-bg__glow ambient-bg__glow--violet" />
      <div className="ambient-bg__spotlight" />
      <div className="ambient-bg__dot-grid" />
      <div className="ambient-bg__top-beam" />
    </div>
  );
};

export default AmbientBackground;
