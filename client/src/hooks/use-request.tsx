import axios, { Method } from "axios";
import { useState } from "react";

type ErrorResponse = {
  message: string;
  field?: string;
};

type UseRequestProps<T> = {
  url: string;
  method: Method;
  body?: T;
  onSuccess?: (data: any) => void;
};

export default function useRequest<T = any>({
  url,
  method,
  body,
  onSuccess,
}: UseRequestProps<T>) {
  const [errors, setErrors] = useState<string[] | null>(null);

  const doRequest = async (overrideBody?: Partial<T>) => {
    try {
      setErrors(null);
      const response = await axios.request({
        url,
        method,
        data: overrideBody || body,
        withCredentials: true,
      });

      console.log("Response:", response);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map(
          (e: ErrorResponse) => e.message
        );
        setErrors(messages);
      } else {
        setErrors(["Something went wrong"]);
      }
    }
  };

  return { doRequest, errors };
}
