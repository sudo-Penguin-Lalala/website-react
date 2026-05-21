import './CircularText.css';

const CircularText = ({ text, radius = 80 }) => {
  const characters = text.split('');
  const angleStep = 360 / characters.length;

  return (
    <div className="circular-text-container">
      <div className="circular-text" style={{ width: radius * 2, height: radius * 2 }}>
        {characters.map((char, index) => {
          const angle = index * angleStep;
          return (
            <span
              key={index}
              className="circular-char"
              style={{
                transform: `rotate(${angle}deg) translateY(-${radius}px)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CircularText;
