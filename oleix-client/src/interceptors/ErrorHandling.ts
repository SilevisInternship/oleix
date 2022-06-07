import axios from 'axios';
import toastr from 'toastr';

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    toastr.error(error.message, error.name);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    const message = error.response?.data?.message;
    toastr.error(message || error.message, 'Error occurred');
    return Promise.reject(error);
  }
);
