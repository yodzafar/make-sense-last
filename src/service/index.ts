import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../index';
import { updateProjectAuth } from '../store/general/actionCreators';

const httpClient = axios.create({
  baseURL: 'https://makesense-bridge-production.up.railway.app',
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  }
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response) {
      const {
        response: { status },
      } = error;
      if (status === 401) {
        Cookies.remove('token');
        Cookies.remove('refresh-token');
        store.dispatch(updateProjectAuth(false));
      } else if (status === 400) {
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

httpClient.interceptors.request.use((config) => {
  const token: string | undefined = Cookies.get('token');

  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    return config;
  }
  delete config?.headers?.Authorization;
  return config;
});


export default httpClient;
