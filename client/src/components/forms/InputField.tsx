import { FieldError } from 'react-hook-form';

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = 'text',
  name,
  register,
  defaultValue,
  error,
  inputProps,
}: InputFieldProps) => {
  const inputId = `input-${name}`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-base text-white font-medium">
        {label}:
      </label>
      <input
        id={inputId}
        type={type}
        {...register(name)}
        className="ring-[1px] font-light ring-primary-300 p-2 rounded-md bg-primary-500"
        defaultValue={defaultValue}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...inputProps}
      />
      {error?.message && (
        <p id={`${inputId}-error`} className="text-xs text-redAccent-400">
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;
