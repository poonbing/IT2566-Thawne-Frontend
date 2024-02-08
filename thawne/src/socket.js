import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const CHATURL = 'http://localhost:5000/chat';
const AUTHURL = 'http://localhost:5000/auth';
const OPERATIONURL = 'http://localhost:5000/operation';


export const socket = io(CHATURL);
