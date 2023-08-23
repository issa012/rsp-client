import axios from 'axios';

export const URL = import.meta.env.VITE_URL;

export const axiosInstance = axios.create({
  withCredentials: true,
});
