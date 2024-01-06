import API_CONFIG from '../config/api';

async function reflectAllChats(userId) {
  try {
    const response = await fetch(API_CONFIG.endpoints.getAllChat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userId),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chat list: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat list:', error.message);
    throw error;
  }
}

async function createChat(chatValues) {
  try {
    const response = await fetch(API_CONFIG.endpoints.createChat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatValues),
    });

    if (!response.ok) {
      throw new Error(`Failed to create chat: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating chat:', error.message);
    throw error;
  }
}

async function submitMessage(content) {
  try {
    const response = await fetch(API_CONFIG.endpoints.submitMessage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error(`Error sending message: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error.message);
    throw error;
  }
}


// async function getMessageList(currentChat) {
//   try {
//     const response = await fetch(API_CONFIG.endpoints.getTopMessages, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(currentChat),
//     }).then((response) => response.json());
//       console.log(response)
//       if (response.success){
//         console.log(response.message)
//         return response.message
//       }
//       else{
//         console.log(response)
//       }

//     if (!response.ok) {
//       throw new Error(`Failed to fetch message list: ${response.status}`);
//     }
//     else{
//       console.log(response)
//       return response.message
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching message list:', error.message);
//     throw error;
//   }
// }

export { reflectAllChats, createChat, submitMessage };
