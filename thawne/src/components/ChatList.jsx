import React, { useState, useEffect } from 'react';

import useToken from '../hooks/useToken';
import { reflectAllChats } from '../api/chatApi';
import SearchBar from './ChatList/SearchBar'; 



function ChatList({ chatList, setChatList, handleChatSelect, openVerifyChatModal, setActiveChat, activeChat, setcurrentChatInfo }) {
  const { token } = useToken();
  const [password, setPassword] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChatList, setFilteredChatList] = useState(chatList);


  useEffect(() => {
    const fetchData = async () => {
        const data = await reflectAllChats(token);
        setChatList(data);
    };

    fetchData();
  }, [token, setChatList]);

  useEffect(() => {
    const filteredList = chatList.filter((chat) =>
      chat.chat_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChatList(filteredList);
  }, [searchTerm, chatList]);



  const handleChatClick = async (index, securityLevel) => {
    if (securityLevel === 'Top Secret' || securityLevel === 'Sensitive') {
      openVerifyChatModal(index);
    } else {
      const selectedChat = chatList[index];
      handleChatSelect(selectedChat);
      setActiveChat(index);
      setcurrentChatInfo({
        chat_id : selectedChat.chat_id,
        userId: token,
        seclvl: securityLevel,
        pass: false
      });
    }
  };
  

  const checkSecurity = (level) => {
    if (level === 'Top Secret') {
      return (
        <div>
          <span className='text-xs bg-red-600 text-white font-semibold p-1 rounded-md'>Top Secret</span>
          <span className='text-white ml-1'><ion-icon name="lock-closed"></ion-icon></span>
        </div>
      );
    } else if (level === 'Sensitive') {
      return <span className='text-xs bg-yellow-600 text-white font-semibold p-1 rounded-md'>Sensitive</span>;
    } else {
      return <span className='text-xs bg-green-600 text-white font-semibold p-1 rounded-md'>Open</span>;
    }
  };

  return (
    <>
    <SearchBar onSearch={setSearchTerm} />
      <div>
        <h2 className="my-4 ml-4 text-lg text-white font-semibold">Chats</h2>
        {filteredChatList.map((chat, index) => (
          <div
            className={`rounded-xl cursor-pointer transition duration-300 ease-in-out ${
              activeChat === index ? 'bg-zinc-700' : 'hover:bg-zinc-700'
            }`}
            key={index}
            onClick={() => {handleChatClick(index, chat.security_level);}}
          >
            <div className="flex items-center px-4 py-3">
              <img
                className="object-cover w-12 h-12 rounded-full mr-4"
                src="/images/default_pfp.png"
                alt="username"
              />

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{chat.chat_name}</span>
                  {checkSecurity(chat.security_level)}
                </div>
                <span className="text-sm text-gray-600">{}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Enter Password</h2>
            <label className='text-gray-700 mb-2'>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-4"
            />
            <div className="flex justify-between">
              <button onClick={handlePasswordSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Submit
              </button>
              <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatList;