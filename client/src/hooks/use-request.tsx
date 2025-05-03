import axios from 'axios';
import { useState } from 'react';

interface UseRequestProps {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  onSuccess?: (data?: any) => void;
}

const useRequest = ({ url, method, onSuccess }: UseRequestProps) => {
  const [errors, setErrors] = useState<null | JSX.Element>(null);

  const doRequest = async (body = {}) => {
    try {
      setErrors(null);

      let response;
      switch (method) {
        case 'get':
          response = await axios.get(url, { params: body });
          break;
        case 'post':
          response = await axios.post(url, body);
          break;
        case 'put':
          response = await axios.put(url, body);
          break;
        case 'delete':
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
      setErrors(
        <div className="bg-red-100 p-2 text-red-800 rounded">
          {err.response?.data?.errors?.map((e: any, i: number) => (
            <div key={i}>{e.message}</div>
          )) || 'An error occurred'}
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
