import socketIOClient from 'socket.io-client';

async function loginUser(credentials) {
    return new Promise((resolve, reject) => {
        const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/auth');
        socket.emit('login', credentials);
        socket.on('return_login', data => {
            socket.disconnect();
            resolve(data);
        });
        socket.on('error_login', error => {
            socket.disconnect();
            reject(error);
        });
    });
}
export { loginUser };