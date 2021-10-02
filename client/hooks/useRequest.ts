import { useState } from 'react';
import axios from 'axios';

interface DataProps {
  email: string;
  id: string;
}

interface BodyProps {
  email: string;
  password: string;
}

interface ErrorsProps {
  message: string;
};

interface ParamProps {
  uri: string;
  body?: BodyProps;
  method: 'post';
  onSuccess?(): void;
}

export const useRequest = ({ uri, body, method, onSuccess }: ParamProps) => {
  const [errors, setErrors] = useState<ErrorsProps[]>([]);
  const doRequest = async (): Promise<DataProps> => {
    try {
      setErrors([]);
      const { data }: { data: DataProps } = await axios[method](uri, body);
      if (onSuccess) {
        onSuccess();
      }
      return data;
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  }
  return { errors, doRequest };
}
