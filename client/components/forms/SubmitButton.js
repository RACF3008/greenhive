import React from 'react';
import styles from './forms.module.css';

const SubmitButton = ({ label }) => {
  return (
    <button className={styles.button} type="submit">
      {label}
    </button>
  );
};

export default SubmitButton;
