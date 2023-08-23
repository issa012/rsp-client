import { io } from 'socket.io-client';
import { URL } from './axios';

export const socket = io(URL, {
  withCredentials: true,
});
