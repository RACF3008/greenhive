import React from 'react';
import styles from './forms.module.css';

const InputField = ({ label, type, placeholder, value, onChange }) => {
  return (
    <div className={styles.inputField}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
