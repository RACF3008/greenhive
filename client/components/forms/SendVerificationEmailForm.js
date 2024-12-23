import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton'; // Assuming SubmitButton is defined in a separate file.
import styles from './forms.module.css';

const SendVerificationEmailForm = ({ email, setEmail, errors, onSubmit }) => {
  const getErrorMessage = (field) => {
    if (errors) {
      const error = errors.find((error) => error.field === field);
      return error ? error.message : null;
    }
  };

  const getGeneralErrors = () => {
    return errors ? errors.filter((error) => !error.field) : [];
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {getGeneralErrors().length > 0 && (
        <div className={styles.generalErrors}>
          {getGeneralErrors().map((error, index) => (
            <p className={styles.error} key={index}>
              {error.message}
            </p>
          ))}
        </div>
      )}
      <InputField
        label="Email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={getErrorMessage('email')}
      />
      <div className={styles.buttonContainer}>
        <SubmitButton label="Send Verification Email" />
      </div>
    </form>
  );
};

export default SendVerificationEmailForm;
