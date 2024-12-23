import React from 'react';

import styles from './Stepper.module.css';

const Stepper = ({
  minutes = 2,
  setMinutes,
  seconds = 0,
  setSeconds,
  step = 5,
}) => {
  // Increment time by the specified step
  const incrementTime = () => {
    setSeconds((prevSeconds) => {
      let newSeconds = prevSeconds + step;
      let newMinutes = minutes;

      // Handle overflow of seconds
      if (newSeconds >= 60) {
        newSeconds = newSeconds % 60; // Reset seconds to 0-59
        newMinutes += 1; // Increment the minutes
      }

      setMinutes(newMinutes); // Update minutes
      return newSeconds;
    });
  };

  // Decrement time by the specified step
  const decrementTime = () => {
    setSeconds((prevSeconds) => {
      let newSeconds = prevSeconds - step;
      let newMinutes = minutes;

      // Handle underflow of seconds (going negative)
      if (newSeconds < 0) {
        newSeconds = 60 + newSeconds; // Adjust seconds and decrement minutes
        newMinutes -= 1;
      }

      if (newMinutes < 0) {
        newMinutes = 0; // Prevent negative minutes
        newSeconds = 0; // Prevent negative seconds
      }

      setMinutes(newMinutes); // Update minutes
      return newSeconds;
    });
  };

  return (
    <div className={styles.controls}>
      <button className={styles.step} onClick={decrementTime}>
        -
      </button>
      <div className={styles.counter}>{String(minutes).padStart(2, '0')}</div>
      <div className={styles.counter}>:</div>
      <div className={styles.counter}>{String(seconds).padStart(2, '0')}</div>
      <button className={styles.step} onClick={incrementTime}>
        +
      </button>
    </div>
  );
};

export default Stepper;
