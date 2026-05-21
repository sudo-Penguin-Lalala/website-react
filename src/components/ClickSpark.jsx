import { useEffect, useRef, useState } from 'react';
import './ClickSpark.css';

const ClickSpark = ({ children }) => {
  const [sparks, setSparks] = useState([]);
  const containerRef = useRef(null);

  const createSpark = (x, y) => {
    const newSparks = [];
    const sparkCount = 8;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount;
      const velocity = 2 + Math.random() * 2;

      newSparks.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
      });
    }

    setSparks((prev) => [...prev, ...newSparks]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.find((ns) => ns.id === s.id)));
    }, 600);
  };

  const handleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createSpark(x, y);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSparks((prev) =>
        prev.map((spark) => ({
          ...spark,
          x: spark.x + spark.vx,
          y: spark.y + spark.vy,
          life: spark.life - 0.02,
        }))
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} onClick={handleClick} className="click-spark-container">
      {children}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="spark"
          style={{
            left: spark.x,
            top: spark.y,
            opacity: spark.life,
          }}
        />
      ))}
    </div>
  );
};

export default ClickSpark;
