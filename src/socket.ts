import { io } from 'socket.io-client';
const URL = 'https://rsp-aj41.onrender.com';

export const socket = io(URL, {
  withCredentials: true,
});
