import React, { useState, useEffect } from 'react';
import MessageList from './ChatView/MessageList';
import MessageInput from './ChatView/MessageInput';
import ChatDetails from './ChatDetails';
import useToken from '../hooks/useToken';
import API_CONFIG from '../config/api';

function ChatView({ selectedChat, chatList, currentChatInfo, isDetailsOpen, setDetailsOpen }) {
  const [messages, setMessages] = useState([]);
  const { token } = useToken();
  

  useEffect(() => {
    if (selectedChat) {
      const newMessages = {
        chatId: currentChatInfo.chat_id,
        userId: token,
        securityLevel: currentChatInfo.seclvl,
        pass: currentChatInfo.pass,
      };

      const getMessageList = async (currentChat) => {
        try {
          const response = await fetch(API_CONFIG.endpoints.getTopMessages, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentChat),
          }).then((response) => response.json());

          if (response.success) {
            setMessages(response.message);
          } else if (!response.success) {
            setMessages([]);
          } else if (!response.ok) {
            throw new Error(`Failed to fetch message list: ${response.status}`);
          }
        } catch (error) {
          console.error('Error fetching message list:', error.message);
          throw error;
        }
      };

      getMessageList(newMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  const checkSecurity = (level) => {
    if (level === 'Top Secret') {
      return <span className='ml-2 text-xs bg-red-600 text-white font-semibold p-1 rounded-md'>Top Secret</span>;
    } else if (level === 'Sensitive') {
      return <span className='ml-2 text-xs bg-yellow-600 text-white font-semibold p-1 rounded-md'>Sensitive</span>;
    } else {
      return <span className='ml-2 text-xs bg-green-600 text-white font-semibold p-1 rounded-md'>Open</span>;
    }
  };

  

  return (
    <div className="lg:col-span-2 lg:block">
      {selectedChat ? (
        <div className={`w-full h-3/4 ${isDetailsOpen ? 'lg:w-2/3' : 'lg:w-full'}`}>
          <div className="relative flex items-center p-3 border-b border-black bg-zinc-800"
          >
            <img className="object-cover w-10 h-10 rounded-full" src="/images/default_pfp.png" alt="username" />
            <span onClick={() => setDetailsOpen(!isDetailsOpen)} className="block ml-2 font-bold text-white hover:text-gray-400 transition-all ease-in-out duration-300 cursor-pointer">{selectedChat.chat_name}</span>
            <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            {checkSecurity(selectedChat.security_level)}
          </div>
          <MessageList messages={messages} />
          <div className='bg-zinc-800'>
            <MessageInput chatList={chatList} currentChatInfo={currentChatInfo} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Select a chat to start messaging.</p>
      )}

      {isDetailsOpen && (
        <ChatDetails
          chatDetails={currentChatInfo}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </div>
  );
  
}

export default ChatView;
