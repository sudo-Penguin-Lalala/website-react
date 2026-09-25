import { motion } from "motion/react";
import Icon from "./Icon";

const Button = ({ href, onClick, icon, label, className, title, index = 0 }) => {
  const commonProps = {
    className: `button ${className}`,
    title,
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      delay: 0.1 + index * 0.05,
      ease: [0.22, 1, 0.36, 1]
    },
    whileHover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.98 }
  };

  if (onClick) {
    return (
      <motion.button {...commonProps} onClick={onClick}>
        <Icon name={icon} className="icon" />
        {label}
      </motion.button>
    );
  }

  return (
    <motion.a
      {...commonProps}
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener' : undefined}
    >
      <Icon name={icon} className="icon" />
      {label}
    </motion.a>
  );
};

export default Button;
