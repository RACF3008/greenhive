import InputField from './InputField';
import SubmitButton from './SubmitButton';
import styles from './forms.module.css';

const SignupForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  username,
  setUsername,
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
        label="First Name"
        type="text"
        placeholder="Insert your first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)} // Usar correctamente setUsername
      />
      {getErrorMessage('firstName') && (
        <p className={styles.error}>{getErrorMessage('firstName')}</p>
      )}
      <InputField
        label="Last Name"
        type="text"
        placeholder="Insert your last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)} // Usar correctamente setUsername
      />
      {getErrorMessage('lastName') && (
        <p className={styles.error}>{getErrorMessage('lastName')}</p>
      )}
      <InputField
        label="Username"
        type="text"
        placeholder="Insert your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)} // Usar correctamente setUsername
      />
      {getErrorMessage('username') && (
        <p className={styles.error}>{getErrorMessage('username')}</p>
      )}
      <p className={styles.caption}>This is the name visible to other users</p>
      <InputField
        label="Email"
        type="email"
        placeholder="Insert your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Usar correctamente setEmail
      />
      {getErrorMessage('email') && (
        <p className={styles.error}>{getErrorMessage('email')}</p>
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
      <InputField
        label="Repeat Password"
        type="password"
        placeholder="Repeat your password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      {getErrorMessage('repeatPassword') && (
        <p className={styles.error}>{getErrorMessage('repeatPassword')}</p>
      )}
      <div className={styles.buttonContainer}>
        <SubmitButton label="Sign Up" />
        <a className={styles.secondaryButton} href="/auth/signin">
          Already have an account? Sign in
        </a>
      </div>
    </form>
  );
};

export default SignupForm;
