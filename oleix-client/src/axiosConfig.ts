import axios from 'axios';
import Cookie from 'js-cookie';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// @ts-ignore
axios.defaults.headers['Content-Type'] = 'application/json';

export const setAuthHeader = (token?: string) => {
  if (token) Cookie.set('access-token', token);

  const retrievedToken = token || Cookie.get('access-token') || '';

  axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    Authorization: `Bearer ${retrievedToken}`,
  };
};

setAuthHeader();
