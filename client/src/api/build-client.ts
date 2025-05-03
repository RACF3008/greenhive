import axios from 'axios';
import { cookies, headers } from 'next/headers';

const buildClient = () => {
  if (typeof window === 'undefined') {
    // We are on the server
    const cookieStore = cookies();
    const headerStore = headers();

    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
