import React, { useState } from 'react';

import styles from './Toggle.module.css';

const Toggle = ({ isOn, toggleHandler, disabled = false }) => {
  const toggleClass = isOn
    ? `${styles.toggleBtn} ${styles.toggled}`
    : `${styles.toggleBtn}`;

  const onClick = () => {
    toggleHandler(!isOn); // Call the parent-provided handler with the desired new state
  };

  return (
    <button
      className={disabled ? `${toggleClass} ${styles.disabled}` : toggleClass}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.thumb}></div>
      <div className={`${styles.msg} ${styles.on}`}>ON</div>
      <div className={`${styles.msg} ${styles.off}`}>OFF</div>
    </button>
  );
};

export default Toggle;
