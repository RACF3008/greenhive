import InputField from './InputField';
import SubmitButton from './SubmitButton';
import styles from './forms.module.css';

const ResetPasswordForm = ({
  password,
  setPassword,
  repeatPassword,
  setRepeatPassword,
  errors,
  onSubmit,
}) => {
  const getErrorMessage = (field) => {
    if (errors) {
      const error = errors.find((error) => error.field === field);
      return error ? error.message : '';
    }
  };

  const getGeneralErrors = () => {
    return errors ? errors.filter((error) => !error.field) : [];
  };
  const generalErrors = getGeneralErrors();

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {generalErrors.length > 0 && (
        <div className={styles.generalErrors}>
          {generalErrors.map((error, index) => (
            <p className={styles.error} key={index}>
              {error.message}
            </p>
          ))}
        </div>
      )}
      <InputField
        label="Password"
        type="password"
        placeholder="Set new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // Usar correctamente setPassword
      />
      {getErrorMessage('password') && (
        <p className={styles.error}>{getErrorMessage('password')}</p>
      )}
      <InputField
        label="Repeat Password"
        type="password"
        placeholder="Repeat your new password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      {getErrorMessage('repeatPassword') && (
        <p className={styles.error}>{getErrorMessage('repeatPassword')}</p>
      )}
      <div className={styles.buttonContainer}>
        <SubmitButton label="Change Password" />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
