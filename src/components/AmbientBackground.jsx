import "./AmbientBackground.css";

const AmbientBackground = () => {
  return (
    <div className="ambient-bg" aria-hidden="true">
      {/* Top subtle horizon accent */}
      <div className="ambient-bg__top-line" />

      {/* Hero Ambient Glow */}
      <div className="ambient-bg__hero-glow" />

      {/* Crisp Subtle Modern Dot Grid */}
      <div className="ambient-bg__dot-grid" />
    </div>
  );
};

export default AmbientBackground;
