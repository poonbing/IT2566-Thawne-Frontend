import React, { useState, useEffect } from "react";

import useUserPassword from "../hooks/useUserPassword";
import useToken from "../hooks/useToken";
import { reflectAllChats } from "../api/chatApi";
import SearchBar from "./ChatList/SearchBar";

function ChatList({
  chatList,
  setChatList,
  setActiveChat,
  activeChat,
  setcurrentChatInfo,
  setIsModalOpen,
  userPassword,
  unlock,
}) {
  const { token } = useToken();
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChatList, setFilteredChatList] = useState(chatList);

  useEffect(() => {
    const fetchData = async () => {
      const data = await reflectAllChats(token, userPassword.password);
      setChatList(data);
    };
    fetchData();
  }, [token, userPassword]);

  useEffect(() => {
    const filteredList = chatList.filter((chat) =>
      chat.chat_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChatList(filteredList);
  }, [searchTerm, chatList]);

  const handleChatClick = async (index, securityLevel) => {
    setActiveChat(index);
    const selectedChat = chatList[index];

    if (securityLevel === "Top Secret" || securityLevel === "Sensitive") {
      setIsModalOpen(true);
      console.log("This is secret");
      console.log(selectedChat);
    } else {
      console.log("This is open");
      console.log(selectedChat);
      setcurrentChatInfo({
        chat_id: selectedChat.chat_id,
        userId: token,
        seclvl: securityLevel,
        pass: false,
      });
    }
  };

  const checkSecurity = (level) => {
    if (level === "Top Secret") {
      return (
        <div>
          <span className="text-xs bg-red-600 text-white font-semibold p-1 rounded-md">
            Top Secret
          </span>
          <span className="text-white ml-1">
            {unlock ? (
              <ion-icon name="lock-open-outline"></ion-icon>
            ) : (
              <ion-icon name="lock-closed"></ion-icon>
            )}
          </span>
        </div>
      );
    } else if (level === "Sensitive") {
      return (
        <span className="text-xs bg-yellow-600 text-white font-semibold p-1 rounded-md">
          Sensitive
        </span>
      );
    } else {
      return (
        <span className="text-xs bg-green-600 text-white font-semibold p-1 rounded-md">
          Open
        </span>
      );
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
              activeChat === index ? "bg-zinc-700" : "hover:bg-zinc-700"
            }`}
            key={index}
            onClick={() => {
              handleChatClick(index, chat.security_level);
            }}
          >
            <div className="flex items-center px-4 py-3">
              <img
                className="object-cover w-12 h-12 rounded-full mr-4"
                src="/images/default_pfp.png"
                alt="username"
              />

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">
                    {chat.chat_name}
                  </span>
                  {checkSecurity(chat.security_level)}
                </div>
                <span className="text-sm text-gray-600">{}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatList;
