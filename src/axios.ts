import axios from 'axios';

export const URL = 'https://rsp-aj41.onrender.com';

export const axiosInstance = axios.create({
  withCredentials: true,
});
