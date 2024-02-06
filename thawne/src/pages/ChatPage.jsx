import React, { useState, useEffect } from "react";
import useToken from "../hooks/useToken";
import socketIOClient from "socket.io-client";
import ChatList from "../components/ChatList";
import ChatView from "../components/ChatView";
import VerifyChatModal from "../components/modals/VerifyChatModal";

function ChatPage({ userPassword, loading, setLoading }) {
  const [currentChatInfo, setcurrentChatInfo] = useState({});
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const { token } = useToken();
  const [unlock, setUnlock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeVerifyChatModal = () => {
    setIsModalOpen(false);
    setActiveChat(null);
    setcurrentChatInfo({});
  };

  const handlePasswordSubmit = async (password) => {
    return new Promise((resolve, reject) => {
      const socket = socketIOClient("http://localhost:5000/auth");
      socket.emit("verify_chat_user", {
        uid: token,
        cid: chatList[activeChat].chat_id,
        seclvl: chatList[activeChat].security_level,
        pass: password,
      });
      socket.on("return_chat_user", (data) => {
        socket.disconnect();
        console.log(data);
        setUnlock(true);
        closeVerifyChatModal();
        setActiveChat(activeChat);
        setcurrentChatInfo({
          chat_id: chatList[activeChat].chat_id,
          userId: token,
          seclvl: chatList[activeChat].security_level,
          pass: password,
        });
        resolve(data);
      });
      socket.on("error_chat_user", (error) => {
        socket.disconnect();
        console.log(error);
        reject(error);
      });
    });
  };

  useEffect(() => {}, [isModalOpen]);

  return (
    <>
      <div className="flex bg-zinc-800 h-full border-black">
        <div className="basis-2/6 overflow-auto">
          <ChatList
            chatList={chatList}
            setChatList={setChatList}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
            setcurrentChatInfo={setcurrentChatInfo}
            setIsModalOpen={setIsModalOpen}
            userPassword={userPassword}
            unlock={unlock}
          />
        </div>
        <div className="container w-screen relative">
          <ChatView
            activeChat={activeChat}
            currentChatInfo={currentChatInfo}
            chatList={chatList}
          />
        </div>
      </div>

      {isModalOpen && (
        <VerifyChatModal
          handlePasswordSubmit={handlePasswordSubmit}
          closeVerifyChatModal={closeVerifyChatModal}
        />
      )}
    </>
  );
}

export default ChatPage;
