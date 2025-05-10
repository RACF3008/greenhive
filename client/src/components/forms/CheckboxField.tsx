import { FieldError } from 'react-hook-form';

type CheckboxFieldProps = {
  text: string | React.ReactNode;
  name: string;
  register: any;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export const CheckboxField = ({
  text,
  name,
  register,
  error,
  inputProps,
}: CheckboxFieldProps) => {
  const inputId = `input-${name}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="checkbox"
          {...register(name)}
          className="w-4 h-4"
        />
        <label htmlFor={inputId} className="text-sm text-white">
          {text}
        </label>
      </div>
      {error?.message && (
        <p id={`${inputId}-error`} className="text-xs text-redAccent-400">
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};
