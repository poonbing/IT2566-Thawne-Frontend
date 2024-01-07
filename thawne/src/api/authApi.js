import socketIOClient from 'socket.io-client';

async function loginUser(credentials) {
    return new Promise((resolve, reject) => {
        const socket = socketIOClient('http://localhost:5000');
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