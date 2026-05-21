import { useEffect, useRef } from 'react';
import './ShinyText.css';

const ShinyText = ({ text, className = '' }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      element.style.setProperty('--x', `${x}px`);
    };

    element.addEventListener('mousemove', handleMouseMove);
    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <span ref={textRef} className={`shiny-text ${className}`}>
      {text}
    </span>
  );
};

export default ShinyText;
