import React, { useState } from 'react';
import styles from './RangeSlider.module.css';

const RangeSlider = ({
  min = 0,
  max = 100,
  step = 5,
  onValueChange,
  disabled = false,
}) => {
  const [value, setValue] = useState(0);

  // Calculate the position of the bubble based on the value
  const calculateBubblePosition = () => {
    const percentage = ((value - min) / (max - min)) * (100 - 9);
    return `${percentage}%`;
  };

  const calculateBackground = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, var(--yellow) ${percentage}%, var(--gray) ${percentage}%)`;
  };

  const handleMouseUp = () => {
    // Trigger the callback when the user releases the slider
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <div
        className={
          disabled ? `${styles.bubble} ${styles.disabled}` : styles.bubble
        }
        style={{ left: calculateBubblePosition() }}
      >
        {value}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onMouseUp={handleMouseUp}
        className={
          disabled ? `${styles.slider} ${styles.disabled}` : styles.slider
        }
        disabled={disabled}
        style={{ background: calculateBackground() }}
      />
    </div>
  );
};

export default RangeSlider;
