import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const CHATURL = 'https://thawne-backend-7skvo7hmpa-uc.a.run.app/chat';
const AUTHURL = 'https://thawne-backend-7skvo7hmpa-uc.a.run.app/auth';
const OPERATIONURL = 'https://thawne-backend-7skvo7hmpa-uc.a.run.app/operation';


export const socket = io(CHATURL);
