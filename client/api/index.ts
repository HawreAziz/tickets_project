import axios, { AxiosInstance } from 'axios';

interface ReqProps {
  headers: {
    host?: string;
    cookie?: string;
  } | null;
}

const buildClient = (req: ReqProps): AxiosInstance => {
  let client: AxiosInstance;
  if (typeof window === 'undefined') {
    client = axios.create({
      baseURL: "http://ingress-nginx-controller.kube-system.svc.cluster.local/",
      headers: req.headers
    });
  } else {
    client = axios.create({
      baseURL: "/"
    });
  }
  return client;
}


export default buildClient;
