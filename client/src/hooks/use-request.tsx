import axios from "axios";
import { useState } from "react";

interface UseRequestProps {
  url: string;
  method: "get" | "post" | "put" | "delete";
  onSuccess?: (data?: any) => void;
}

const useRequest = ({ url, method, onSuccess }: UseRequestProps) => {
  const [errors, setErrors] = useState<null | string>(null);

  const doRequest = async (body = {}) => {
    try {
      setErrors(null);

      console.log("Sending request to:", url);
      console.log("Request body:", body);

      let response;
      switch (method) {
        case "get":
          response = await axios.get(url, { params: body });
          break;
        case "post":
          response = await axios.post(url, body);
          break;
        case "put":
          response = await axios.put(url, body);
          break;
        case "delete":
          response = await axios.delete(url, { data: body });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      const errorMessages =
        err.response?.data?.errors?.map((e: any) => e.message).join("\n") ||
        "An unexpected error occurred";

      setErrors(
        err.response?.data?.errors?.map((e: any) => e.message).join(", ") ||
          "An unexpected error occurred"
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
