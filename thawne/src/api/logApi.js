import socketIOClient from 'socket.io-client';

async function logEvent(logInfo) {
  
    return new Promise((resolve, reject) => {
      try {
        const socket = socketIOClient('http://localhost:5000/log');
    
        socket.emit('log_event', logInfo);
        socket.on('return_log_event', (data) => {
          // socket.disconnect();
          console.log(data)
          resolve(data);
        });
        socket.on('error_log_event', (error) => {
          // socket.disconnect();
          reject(new Error(`Failed to log event: ${error.message}`));
        });
      } catch (error) {
        console.error('Error logging event:', error.message);
        reject(error);
      }
    });
  }

export {logEvent}