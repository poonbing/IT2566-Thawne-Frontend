import socketIOClient from 'socket.io-client';
import axios from 'axios'


async function reflectAllChats(userId, password) {
  console.log(password);

  return new Promise((resolve, reject) => {
    try {
      const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/chat');
      const chatData = {
        userId: userId,
        password: password,
      };
      socket.emit('reflect_all_chats', chatData);
      socket.on('return_all_chats', (data) => {
        socket.disconnect();
        resolve(data);
      });
      socket.on('error_all_chats', (error) => {
        socket.disconnect();
        reject(new Error(`Failed to fetch chat list: ${error.message}`));
      });
    } catch (error) {
      console.error('Error fetching chat list:', error.message);
      reject(error);
    }
  });
}

async function createChat(chatValues) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/operation');
    socket.emit('create_chat', chatValues);
    const data = "Pending chat creation request...";
    resolve(data);

  });
}

async function deleteChat(chatValues) {
  return new Promise((resolve) => {
    const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/operation');
    socket.emit('delete_chat', chatValues);
    const data = "Pending chat deletion request...";
    resolve(data);

  });
}

async function submitMessage(content) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/chat');
    socket.emit('submit_message', content);
    socket.on('return_message_submission', (data) => {
      console.log(data)
      resolve(data);
      
    });
    socket.on('error_message_submission', (error) => {
      reject(new Error(`Error sending message: ${error.message}`));
    });
  });
}


async function getMessageList(currentChat) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/chat');
    socket.emit('get_message_list', currentChat);
    socket.on('return_message_list', (data) => {
      resolve(data);
    });
    socket.on('error_message_list', (error) => {
      reject(new Error(`Error fetching message list: ${error.message}`));
    });
  });
}

async function checkFileName(file) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app');
    socket.emit('check_filename', file);
    socket.on('return_filename_check', (data) => {
      resolve(data);

    });
    socket.on('error_message_list', (error) => {
      reject(new Error(`Error fetching message list: ${error.message}`));
    });
  });
}

async function fileScan(file) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/chat');
    socket.emit('on_queue_file', file);
    socket.on('return_filename_check', (data) => {
      socket.disconnect();
      resolve(data); 
    });
    socket.on('error_message_list', (error) => {
      socket.disconnect();
      reject(new Error(`Error with file upload: ${error.message}`));
    });
    socket.on('inappropriate_level', (error) => {
      socket.disconnect();
      alert(` File upload is not allowed. \n Granted security level: ${error}`)
    });
  });
};


async function fileUpload(file) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('https://thawne-backend-7skvo7hmpa-uc.a.run.app/chat');
    socket.emit('file_upload', file);
    socket.on('return_filename_check', (data) => {
      resolve(data); 
    });
    socket.on('error_message_list', (error) => {
      reject(new Error(`Error with file upload: ${error.message}`));
    });
    socket.on('return_file_upload', (message) => {
      alert(` Signed URL. \n Details: ${message.url}`)
      console.log(message.url)
      let encryptedFile = file.file
      if (file.fileSecurity == 'Sensitive'){
        encryptedFile = encryptData(file.file, file.chatId)
      }
      const uploadResponse = fetch(message.url, {
        mode: 'cors',
        method: 'PUT',
        body: encryptedFile,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (uploadResponse.ok) {
        console.log('File uploaded successfully!');
      } else {
        console.error('Error uploading file:', uploadResponse.statusText);
      }
    });
    socket.on('inappropriate_level', (error) => {
      alert(` File upload is not allowed. \n Granted security level: ${error}`)
    });
  });
}


export { reflectAllChats, createChat, deleteChat, submitMessage, getMessageList, fileUpload };
