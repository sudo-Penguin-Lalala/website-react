import './ShinyText.css';

const ShinyText = ({ text, className = '' }) => {
  return (
    <span className={`shiny-text ${className}`}>
      {text}
    </span>
  );
};

export default ShinyText;
