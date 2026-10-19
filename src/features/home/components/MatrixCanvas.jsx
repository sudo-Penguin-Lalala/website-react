import { useRef, useEffect } from "react";

const MatrixCanvas = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const isMobile = window.innerWidth <= 640;
    // On mobile, use larger column spacing/font size so we draw fewer drops (saving GPU draw calls)
    const fontSize = isMobile ? 22 : 14;
    // Lock to 24fps on mobile (saves battery, prevents heat, matches classic CRT cadence) vs 36fps on desktop
    const targetFps = isMobile ? 24 : 36;
    const frameInterval = 1000 / targetFps;

    let columns = Math.max(1, Math.floor(window.innerWidth / fontSize));
    let drops = Array(columns).fill(1);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.max(1, Math.floor(canvas.width / fontSize));
      drops = Array(columns).fill(1);
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜNNT_REACTOR";
    let lastTime = 0;

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      if (!lastTime) {
        lastTime = currentTime;
      } else {
        const elapsed = currentTime - lastTime;
        if (elapsed < frameInterval) return;
        lastTime = currentTime - (elapsed % frameInterval);
      }

      ctx.fillStyle = "rgba(10, 14, 20, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`nc-matrix-canvas ${active ? "is-active" : "is-leaving"}`}
      aria-hidden="true"
    />
  );
};

export default MatrixCanvas;
