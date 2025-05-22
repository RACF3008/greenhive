"use client";

import { FieldError } from "react-hook-form";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type PasswordFieldProps = {
  label: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const PasswordField = ({
  label,
  name,
  register,
  error,
  inputProps,
}: PasswordFieldProps) => {
  const inputId = `input-${name}`;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2 relative">
      <label htmlFor={inputId} className="text-base text-white font-medium">
        {label}:
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          {...register(name)}
          className="w-full ring-[1px] font-light ring-primary-300 p-2 pr-10 rounded-md bg-primary-500"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-white focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <VisibilityOffIcon fontSize="small" />
          ) : (
            <VisibilityIcon fontSize="small" />
          )}
        </button>
      </div>
      {error?.message && (
        <p id={`${inputId}-error`} className="text-xs text-redAccent-400">
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
