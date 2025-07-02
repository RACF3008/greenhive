import axios, { Method } from "axios";
import { useState } from "react";

type ErrorResponse = {
  message: string;
  field?: string;
};

type UseRequestProps<T> = {
  url: string;
  method: "get" | "post" | "put" | "delete";
  body?: T;
  onSuccess?: (data: any) => void;
};

export default function useRequest<T = any>({
  url,
  method,
  body,
  onSuccess,
}: UseRequestProps<T>) {
  const [errors, setErrors] = useState<string[]>([]);

  const doRequest = async (props = {}) => {
    try {
      setErrors([]);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map(
          (e: ErrorResponse) => e.message
        );
        setErrors(messages); // <- array of strings
      } else {
        setErrors(["Something went wrong"]);
      }
    }
  };

  return { doRequest, errors };
}
