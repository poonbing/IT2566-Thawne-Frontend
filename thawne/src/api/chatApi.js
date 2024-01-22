import socketIOClient from 'socket.io-client';


async function reflectAllChats(userId, password) {
  console.log(password);
  return new Promise((resolve, reject) => {
    try {
      const socket = socketIOClient('http://localhost:5000');
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
    const socket = socketIOClient('http://localhost:5000');
    socket.emit('create_chat', chatValues);
    socket.on('return_chat_creation', (data) => {
      socket.disconnect();
      resolve(data);
    });
    socket.on('error_chat_creation', (error) => {
      socket.disconnect();
      reject(new Error(`Error creating chat: ${error.message}`));
    });
  });
}

async function submitMessage(content) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('http://localhost:5000');
    socket.emit('submit_message', content);
    socket.on('return_message_submission', (data) => {
      socket.disconnect();
      resolve(data);
    });
    socket.on('error_message_submission', (error) => {
      socket.disconnect();
      reject(new Error(`Error sending message: ${error.message}`));
    });
  });
}


async function getMessageList(currentChat) {
  return new Promise((resolve, reject) => {
    const socket = socketIOClient('http://localhost:5000');
    socket.emit('get_message_list', currentChat);
    socket.on('return_message_list', (data) => {
      socket.disconnect();
      resolve(data);

    });
    socket.on('error_message_list', (error) => {
      socket.disconnect();
      reject(new Error(`Error fetching message list: ${error.message}`));
    });
  });
}

export { reflectAllChats, createChat, submitMessage, getMessageList };
