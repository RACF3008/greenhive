import InputField from './InputField';
import SubmitButton from './SubmitButton';
import styles from './forms.module.css';

const SignupForm = ({
  identifier,
  setIdentifier,
  password,
  setPassword,
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
        label="Identity"
        type="text"
        placeholder="Insert username or email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      {getErrorMessage('identifier') && (
        <p className={styles.error}>{getErrorMessage('identifier')}</p>
      )}
      <InputField
        label="Password"
        type="password"
        placeholder="Insert your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // Usar correctamente setPassword
      />
      {getErrorMessage('password') && (
        <p className={styles.error}>{getErrorMessage('password')}</p>
      )}
      <a className={styles.hyperlink} href="/auth/send-reset-email">
        Forgot your password?
      </a>

      <div className={styles.buttonContainer}>
        <SubmitButton label="Sign In" />
        <a className={styles.secondaryButton} href="/auth/signin">
          Don't have an account? Sign up
        </a>
      </div>
    </form>
  );
};

export default SignupForm;
